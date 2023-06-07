import { Router, Request, Response } from "express";
import authValidator from "../validators/authValidator";
import authController from "../controller/authController";

const routes = Router()


routes.post("/user/signup", authValidator.signUp, authController.signUp);
routes.post("/user/signin", authController.signIn);
export default routes