import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Drive from "@ioc:Adonis/Core/Drive";
import Env from "@ioc:Adonis/Core/Env";
// import Post from "App/Models/Post";
// import PostValidator from "App/Validators/PostValidator";
import Application from "@ioc:Adonis/Core/Application";
// import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
const sharp = require("sharp");

export default class UploadImagesController {
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      await auth.use("jwt").authenticate();
      const userName = auth.use("jwt").payload!.user.name.split(" ").join("");
      const userId = auth.use("jwt").payload!.userId;
      const user = await User.findByOrFail("id", userId);

      if (user.avatar) {
        const imageNameDelete = user.avatar.split("/").slice(-1)[0];
        await Drive.delete(imageNameDelete);
      }

      const inputImage = request.file("avatar");
      const imageName =
        new Date().getTime().toString() + `_${userName}.${inputImage?.extname}`;

      const resizedImageData = await sharp(inputImage?.tmpPath)
        .resize(300)
        .png()
        .toBuffer();

      if (inputImage) {
        await Drive.put(imageName, resizedImageData);
      }

      user.avatar = `http://${Env.get("HOST")}:${Env.get("PORT")}/${Env.get(
        "PREFIX"
      )}/avatar/${imageName}`;

      user.save();

      return response.status(200).json({
        message: "success upload Avatar",
        user,
      });
    } catch (error) {
      response.status(400).json(error);
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

      // return response.status(200).json({
      //   message: "success upload Post",
      //   urlImage,
      // });
    } catch (error) {
      response.badRequest({ error });
    }
  }
}
