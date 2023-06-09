import { Router, Request, Response } from "express";
import authValidator from "../validators/authValidator";
import authController from "../controller/authController";
import authenticateToken from "../middleware/authnticatToken";
import userController from "../controller/userController";
import userEditValidator from "../validators/userEditValidator";

const routes = Router()


routes.post("/user/signup", authValidator.signUp, authController.signUp);
routes.post("/user/signin", authController.signIn);

routes.get("/user/me",authenticateToken, userController.me);
routes.put("/user/me",authenticateToken, userEditValidator.editUser, userController.editMe);
// routes.delete("/user/me",authenticateToken , userController.delete);
routes.get("/user/:id", userController.getUser);

export default routes