import { Router } from "express";
import { loginController, registerUserController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginController);

export default userRouter;