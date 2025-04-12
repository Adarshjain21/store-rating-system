import { Router } from "express";
import {
    getUserDetails,
  loginController,
  logoutController,
  registerUserController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.get("/getUserDetails", auth, getUserDetails);

export default userRouter;
