import { AuthConfig } from "@ioc:Adonis/Addons/Auth";
import Env from "@ioc:Adonis/Core/Env";

const authConfig: AuthConfig = {
  guard: "jwt",
  guards: {
    web: {
      driver: "session",

      provider: {
        driver: "lucid",

        identifierKey: "id",

        uids: ["email"],

        model: () => import("App/Models/User"),
      },
    },

    api: {
      driver: "oat",

      tokenProvider: {
        type: "api",
        driver: "database",
        table: "api_tokens",
        foreignKey: "user_id",
      },

      provider: {
        driver: "lucid",

        identifierKey: "id",

        uids: ["email", "username"],

        model: () => import("App/Models/User"),
      },
    },

    basic: {
      driver: "basic",
      realm: "Login",

      provider: {
        driver: "lucid",

        identifierKey: "id",

        uids: ["email"],

        model: () => import("App/Models/User"),
      },
    },
    jwt: {
      driver: "jwt",
      publicKey: Env.get("JWT_PUBLIC_KEY", "").replace(/\\n/g, "\n"),
      privateKey: Env.get("JWT_PRIVATE_KEY", "").replace(/\\n/g, "\n"),
      persistJwt: true,
      jwtDefaultExpire: "2d",
      refreshTokenDefaultExpire: "2d",
      tokenProvider: {
        type: "api",
        driver: "database",
        table: "jwt_tokens",
        foreignKey: "user_id",
      },
      provider: {
        driver: "lucid",
        identifierKey: "id",
        uids: ["email", "username"],
        model: () => import("App/Models/User"),
      },
    },
  },
};

export default authConfig;
