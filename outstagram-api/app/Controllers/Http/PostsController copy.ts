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
    const { offset = 0, limit = 5 } = request.all();
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
      .offset(offset)
      .limit(limit);

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
      const postId = lastPostId[0].id + 1;
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
      newPost.image = `localhost:${Env.get("PORT")}/${Env.get(
        "PREFIX"
      )}/post/image/${imageName}`;

      newPost.save();

      return response.status(200).json({
        message: "success upload Post",
        newPost,
        userName,
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
      editPost.save();

      return response.ok({
        message: "edited Post",
        editPost,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }
  public async showByUser({ response, params }: HttpContextContract) {
    try {
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
      deletedPost.delete();
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
