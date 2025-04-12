import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  createUserAdmin,
  getAdminDashboard,
  getAllUsersAdmin,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/getAllUsersAdmin", auth, admin, getAllUsersAdmin);
adminRouter.post("/createUserAdmin", auth, admin, createUserAdmin);
adminRouter.get("/getAdminDashboard", auth, admin, getAdminDashboard);

export default adminRouter;
