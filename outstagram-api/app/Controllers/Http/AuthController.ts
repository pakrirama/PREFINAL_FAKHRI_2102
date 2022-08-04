import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserValidator from "App/Validators/UserValidator";
import User from "App/Models/User";
import Mail from "@ioc:Adonis/Addons/Mail";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

const sendVerification = async (user, auth, data) => {
  const vertoken = await auth.use("jwt").generate(user, {
    payload: {
      isEmailVerification: true,
    },
  });

  const url_verify = "http://localhost:3000/verify/" + vertoken.accessToken;
  console.log(url_verify);

  await Mail.send((message) => {
    message
      .from("fakhri.nodemailer@gmail.com")
      .to(data.email)
      .subject("Welcome Onboard!")
      .htmlView("mail/verification", {
        url_verify,
        name: user.name,
        username: user.username,
      });
  });

  return vertoken;
};

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const data = await request.validate(UserValidator);
      const newUser = await User.create(data);

      const verToken = await sendVerification(newUser, auth, data);
      return response.created({
        status: "success create user",
        result: newUser,
        verToken,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }

  public async login({ request, response, auth }) {
    const { uid, password } = request.all();
    try {
      const jwt = await auth.use("jwt").attempt(uid, password);
      const userModel = auth.use("jwt").user!;

      return response.status(200).json({
        message: "Login succed",

        result: { jwt, userModel, uid },
      });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }

  public async keepLogin({ request, response, auth }) {
    console.log(request.headers());

    try {
      await auth.use("jwt").authenticate();
      const userModel = auth.use("jwt").user!;

      //generate newToken

      // const user = auth.use("jwt").user!;
      // const newToken = await auth.use("jwt").generate(user);

      return response.status(200).json({
        message: "Renewed user token",
        result: {
          userModel,
          // newToken,
        },
      });
    } catch (err) {
      console.log(err);
      response.badRequest({ err });
    }
  }

  public async verifyUser({ response, auth }) {
    try {
      await auth.use("jwt").authenticate();
      const userPayloadFromJwt = auth.use("jwt").payload!;

      if (!userPayloadFromJwt || !userPayloadFromJwt.isEmailVerification) {
        return response
          .status(400)
          .json({ error: " not an verify token or token expired" });
      }

      const user = await User.findByOrFail("id", userPayloadFromJwt.userId);
      user.is_verified = true;
      user.save();

      return response.status(200).json({
        message: "user verified",
        userPayloadFromJwt,
        user,
      });
    } catch (err) {
      console.log("error");
      return response.status(500).json({
        message: err.message,
      });
    }
  }
  public async show({ response, auth }: HttpContextContract) {
    try {
      await auth.use("jwt").authenticate();
      const userId = auth.use("jwt").payload!.userId;
      const user = await User.findByOrFail("id", userId);

      response.status(200).json({ message: "success get post", user });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }
  public async showByUsername({ response, params }: HttpContextContract) {
    try {
      const username = params.username;
      const user = await User.findByOrFail("username", username);

      response.status(200).json({ message: "success get post", user });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      // const payload = request.all();
      await auth.use("jwt").authenticate();
      const userId = auth.use("jwt").payload!.userId;
      const user = await User.findByOrFail("id", userId);

      const editUserSchema = schema.create({
        name: schema.string([rules.minLength(6)]),
        username: schema.string([
          rules.minLength(8),
          rules.unique({
            table: "users",
            column: "username",
            whereNot: {
              id: userId,
            },
          }),
        ]),
        bio: schema.string([rules.maxLength(300)]),
      });

      const data = await request.validate({ schema: editUserSchema });

      user.name = data.name;
      user.username = data.username;
      user.bio = data.bio;

      user.save();

      response.status(200).json({ message: "success get post", user, data });
    } catch (error) {
      response.badRequest({ error });
    }
  }
}
