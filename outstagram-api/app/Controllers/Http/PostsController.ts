import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";
import PostValidator from "App/Validators/PostValidator";
import Application from "@ioc:Adonis/Core/Application";
import Drive from "@ioc:Adonis/Core/Drive";
import Env from "@ioc:Adonis/Core/Env";

import { schema, rules } from "@ioc:Adonis/Core/Validator";

const sharp = require("sharp");

export default class PostsController {
  public async index({ response, request }: HttpContextContract) {
    const { page = 1, limit = 5 } = request.all();
    // const limit = request.input();

    const posts = await Post.query()
      .orderBy("id", "desc")
      .withCount("comments")
      .preload("comments", (commentQuery) => {
        commentQuery.select("id", "user_id", "comment");
      })
      .preload("user_id", (userQuery) => {
        userQuery.select("username", "avatar");
      })
      .preload("like", (userQuery) => {
        userQuery.select("user_id");
      })
      .paginate(page, limit);

    response.status(200).json({ message: "success get posts", posts });
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      console.log("ini apa  " + request.headers().authorization);
      await auth.use("jwt").authenticate();
      const userName = auth.use("jwt").payload!.user.name.split(" ").join("");
      const userId = auth.use("jwt").payload!.userId;

      const lastPostId = await Post.query()
        .select("id")
        .orderBy("id", "desc")
        .limit(1);

      const postId = lastPostId[0]?.id + 1 || 1;

      const payload = await request.validate(PostValidator);
      const inputImage = request.file("image");

      const imageName =
        new Date().getTime().toString() +
        `_${userName}_${postId}.${inputImage?.extname}`;

      const resizedImageData = await sharp(inputImage?.tmpPath)
        .resize(800)
        .png()
        .toBuffer();

      if (inputImage) {
        await Drive.put(imageName, resizedImageData);
      }

      // const contents = await Drive.get(Application.tmpPath(imageName));
      // tanpa resize
      // if (inputImage) {
      //   await inputImage.move(Application.tmpPath("uploads"), {
      //     name: imageName,
      //   });
      // }

      const newPost = new Post();
      newPost.caption = payload?.caption;
      newPost.location = payload?.location;
      newPost.userId = userId;
      newPost.image = `http://${Env.get("HOST")}:${Env.get("PORT")}/${Env.get(
        "PREFIX"
      )}/post/image/${imageName}`;

      await (
        await newPost.save()
      ).preload("user_id", (userQuery) => {
        userQuery.select("username", "avatar");
      });

      return response.status(200).json({
        message: "success upload Post",
        newPost,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const post = await Post.query()
        .where("id", params.postId)
        .withCount("comments")
        .preload("comments", (commentQuery) => {
          commentQuery.select("id", "user_id", "comment");
        })
        .preload("user_id", (userQuery) => {
          userQuery.select("username", "avatar");
        })
        .preload("like");

      response
        .status(200)
        .json({ message: "success get post by postId", post });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async create({ params, response }: HttpContextContract) {
    try {
      const filePath = params.fileName;
      const isExist = await Drive.exists(filePath);
      const urlImage = await Drive.getUrl(filePath);
      console.log(isExist);
      if (isExist) {
        console.log("mashok");
        response.download(Application.tmpPath(urlImage));
      }
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const captionSchema = schema.create({
      caption: schema.string([rules.maxLength(200)]),
    });
    try {
      const editPost = await Post.findOrFail(params.postId);
      const payload = await request.validate({ schema: captionSchema });

      console.log(payload);
      console.log("asas");

      editPost.caption = payload?.caption;
      await editPost.save();

      const editedPost = await Post.query()
        .where("id", editPost.id)
        .preload("user_id", (query) => {
          query.select("avatar", "username");
        })
        .preload("like", (userQuery) => {
          userQuery.select("user_id");
        });

      return response.ok({
        message: "edited Post",
        editedPost,
        editPost,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }
  public async showByUser({ response, params }: HttpContextContract) {
    try {
      // await auth.use("jwt").authenticate();
      // const userId = auth.use("jwt").payload!.userId;
      const userId = params.userId;
      const post = await Post.query().where("userId", userId);

      response.status(200).json({ message: "success get post by user", post });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const deletedPost = await Post.findOrFail(params.postId);
      const imageName = deletedPost.image.split("/").slice(-1)[0];
      await Drive.delete(imageName);
      await deletedPost.delete();
      return response.ok({
        message: "deleted",
        imageName,
        deletedPost,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }
}
