import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.group(() => {
  // User
  Route.get("/user", "AuthController.show").as("auth.show");
  Route.get("/user/:username", "AuthController.showByUsername").as(
    "auth.showByUsername"
  );
  Route.patch("/user", "AuthController.update").as("auth.update");
  Route.post("/register", "AuthController.register").as("auth.register");
  Route.post("/login", "AuthController.login").as("auth.login");
  Route.post("/upload/avatar", "UploadImagesController.store").as(
    "avatar.store"
  );
  Route.get("/avatar/:fileName", "PostsController.create").as("avatar.create");

  Route.post("/refresh-token", "AuthController.keepLogin")
    .as("auth.keepLogin")
    .middleware(["auth"]);

  //TOKEN
  Route.patch("/verify/:vertoken", "AuthController.verifyUser");
  Route.post("/verify/user", "VerificationTokensController.verifyToken");
  Route.post(
    "/verify/password",
    "VerificationTokensController.resetPasswordToken"
  );

  Route.patch(
    "/reset/password/:token",
    "ResetPasswordsController.resetPassword"
  );

  // Route.resource("/post", "PostsController.upload").apiOnly();
  Route.post("/post", "PostsController.store").as("post.store");
  Route.get("/post", "PostsController.index").as("post.index");
  Route.delete("/post/:postId", "PostsController.destroy").as("post.destroy");
  Route.patch("/post/:postId", "PostsController.update").as("post.update");
  Route.get("/post/:postId", "PostsController.show").as("post.show");
  Route.get("/post/user/:userId", "PostsController.showByUser").as(
    "post.showByUser"
  );
  Route.get("/post/image/:fileName", "PostsController.create").as(
    "post.create"
  );

  //Like
  Route.post("/post/:postId/like", "LikesController.store").as("like.store");
  Route.get("/like/:userId", "LikesController.show").as("like.show");
  Route.get("/post/:postId/likes", "LikesController.index").as("like.index");
  // Route.delete("/post/:postId/like", "LikesController.destroy").as(
  //   "auth.destroy"
  // );

  Route.post("post/:postId/comment", "CommentsController.store").as(
    "comment.store"
  );
  Route.get("post/:postId/comment", "CommentsController.index").as(
    "comment.index"
  );
  Route.delete(
    "post/:postId/comment/:commentId",
    "CommentsController.destroy"
  ).as("comment.destroy");
}).prefix("/api/v1");
