import { Router, Request, Response } from "express";
import authValidator from "../validators/authValidator";
import authController from "../controller/authController";
import authenticateToken from "../middleware/authnticatToken";
import userController from "../controller/userController";
import userEditValidator from "../validators/userEditValidator";
import postController from "../controller/postController";
import postValidator from "../validators/postValidator";

const routes = Router()


routes.post("/user/signup", authValidator.signUp, authController.signUp);
routes.post("/user/signin", authController.signIn);

routes.get("/user/me", authenticateToken, userController.me);
routes.put("/user/me", authenticateToken, userEditValidator.editUser, userController.editMe);
routes.delete("/user/me", authenticateToken, userController.deleteUser);
routes.get("/user/:id", userController.getUser);

routes.get("/post", postController.get);
routes.get("/post/my", authenticateToken, postController.getMy);
routes.post("/post", authenticateToken, postValidator.create, postController.create);
routes.post("/post/like", authenticateToken, postController.like);
routes.delete("/post", postController.deletePost);

export default routes