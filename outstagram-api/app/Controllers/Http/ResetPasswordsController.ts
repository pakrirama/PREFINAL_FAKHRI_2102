import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class ResetPasswordsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async resetPassword({ request, response, auth }: HttpContextContract) {
    try {
      await auth.use("jwt").authenticate();
      const userPayloadFromJwt = auth.use("jwt").payload!;
      const userId = auth.use("jwt").payload!.userId;

      if (!userPayloadFromJwt || !userPayloadFromJwt.isForgetPassword) {
        return response
          .status(400)
          .json({ error: " not an reset password token or token expired" });
      }

      const newPassword = request.input("password");

      const user = await User.findByOrFail("id", userId);

      user.password = newPassword;

      user.save();

      response.status(200).json({ message: "success get post", user });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
