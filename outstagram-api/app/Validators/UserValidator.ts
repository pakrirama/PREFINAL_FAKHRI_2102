import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(6)]),
    avatar: schema.string(),
    username: schema.string({ trim: true }, [
      rules.minLength(8),
      rules.unique({ table: "users", column: "username" }),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
    ]),
    password: schema.string({}, [rules.minLength(6)]),
  });
  public messages: CustomMessages = {
    required: "Kolom {{field}} harus diisi",
    "username.unqie": " {{field}} sudah terdaftar",
    "email.unqie": " {{field}} sudah terdaftar",
    email: "masukdan email dengan benar",
  };
}
