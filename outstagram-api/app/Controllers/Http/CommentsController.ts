import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Comment from "App/Models/Comment";
import Post from "App/Models/Post";

export default class CommentsController {
  public async index({ response, params, request }: HttpContextContract) {
    const { page = 1, limit = 5 } = request.all();

    try {
      const comments = await Comment.query()
        .where("post_id", params.postId)
        .preload("user_id", (query) => {
          query.select("username", "avatar");
        })
        // .offset(offset)
        // .limit(limit);
        .paginate(page, limit);

      return response.created({
        status: "succes menambahkan comment",
        comments,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ auth, request, response, params }: HttpContextContract) {
    try {
      const post = await Post.findByOrFail("id", params.postId);
      await auth.use("jwt").authenticate();
      const user = auth.use("jwt").user!;
      const post_id = post.id;
      const user_id = user.id;
      const payload = await request.all();
      console.log(user);

      const comment = new Comment();
      comment.comment = payload.comment;
      comment.postId = post_id;
      comment.userId = user_id;

      await (
        await comment.save()
      ).preload("user_id", (query) => {
        query.select("username", "avatar");
      });

      console.log(comment);
      return response.created({
        status: "succes menambahkan comment",
        comment,
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const deleteComment = await Comment.findOrFail(params.commentId);
      deleteComment.delete();
      return response.ok({
        message: "comment deleted",
      });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }
}
