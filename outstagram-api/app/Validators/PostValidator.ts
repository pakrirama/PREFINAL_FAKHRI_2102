import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class PostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    image: schema.file({
      // size: "2mb",
      extnames: ["jpg", "gif", "png", "jpeg", "JPG", "JPEG", "PNG"],
    }),
    caption: schema.string({ trim: true }, [rules.maxLength(200)]),
    location: schema.string(),
  });

  public messages: CustomMessages = {};
}
