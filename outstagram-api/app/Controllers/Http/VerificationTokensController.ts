import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import Jwt from "App/Models/Jwt_token";

export default class VerificationTokensController {
  public async index({}: HttpContextContract) {}

  public async verifyToken({ request, response, auth }: HttpContextContract) {
    const prevKey = request.input("vertokKey");
    try {
      await auth.use("jwt").authenticate();
      const userId = auth.use("jwt").payload!.userId;
      const user = await User.findByOrFail("id", userId);

      //delete previouse token
      const prevToken = await Jwt.query()
        .where("refresh_token", prevKey)
        .delete();

      const token = await auth.use("jwt").generate(user, {
        payload: {
          isEmailVerification: true,
        },
      });

      const url_verify = "http://localhost:3000/verify/" + token.accessToken;
      console.log(url_verify);

      await Mail.send((message) => {
        message
          .from("fakhri.nodemailer@gmail.com")
          .to(user.email)
          .subject("Welcome Onboard!")
          .htmlView("mail/verification", {
            url_verify,
            name: user.name,
            username: user.username,
          });
      });
      return response.ok({
        status: "success send token to email",
        user,
        token,
        url_verify,
        prevToken,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }

  public async resetPasswordToken({
    request,
    response,
    auth,
  }: HttpContextContract) {
    try {
      const email = request.input("email");
      const prevKey = request.input("rpKey");
      const user = await User.findByOrFail("email", email);

      await Jwt.query().where("refresh_token", prevKey).delete();

      const token = await auth.use("jwt").generate(user, {
        payload: {
          isForgetPassword: true,
        },
      });

      const forgot_password_url =
        "http://localhost:3000/reset-password/" + token.accessToken;
      console.log(forgot_password_url);

      await Mail.send((message) => {
        message
          .from("fakhri.nodemailer@gmail.com")
          .to(user.email)
          .subject("Reset Password")
          .htmlView("mail/reset_password", {
            forgot_password_url,
            name: user.name,
            username: user.username,
          });
      });
      return response.ok({
        status: "success send token to email",
        user,
        token,
        forgot_password_url,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
