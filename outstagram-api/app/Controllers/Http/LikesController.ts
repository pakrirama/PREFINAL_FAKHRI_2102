import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Like from "App/Models/Like";
import Post from "App/Models/Post";

export default class LikesController {
  public async index({ response, params }: HttpContextContract) {
    try {
      const like = await Like.query()
        .where("post_id", params.postId)
        .preload("user_id", (query) => {
          query.select("username", "avatar");
        });

      return response.created({
        like,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ auth, response, params }: HttpContextContract) {
    try {
      const post = await Post.findByOrFail("id", params.postId);

      await auth.use("jwt").authenticate();
      const user = auth.use("jwt").user!;
      const post_id = post.id;
      const user_id = user.id;

      const showLikeByuserId = await Like.query()
        .where("post_id", params.postId)
        .where("user_id", user_id);

      const like = new Like();

      if (showLikeByuserId.length) {
        await Like.query()
          .where("post_id", params.postId)
          .where("user_id", user_id)
          .delete();

        post.likes -= 1;
        post.save();
        return response.ok({
          status: "like deleted",
          like,
        });
      } else {
        like.postId = post_id;
        like.userId = user_id;
        like.save();

        post.likes += 1;
        post.save();

        return response.created({
          status: "like added",
          like,
        });
      }
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const showLikeByuserId = await Like.query()
        .where("user_id", params.userId)
        .preload("post_id", (query) => {
          query.select("image");
        });

      return response.ok({
        showLikeByuserId,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      await auth.use("jwt").authenticate();
      const userId = auth.use("jwt").user!.id;

      // const deleteLike = await Post.query()
      //   .where("id", params.postId)
      //   .select("id")
      //   .preload("like", (query) => {
      //     query.where("user_id", userId).select();
      //   });

      const deleteLike = await Like.query()
        .where("user_id", userId)
        .where("post_id", params.postId)
        .delete();

      return response.ok({
        message: "like deleted",
        deleteLike,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }
}
