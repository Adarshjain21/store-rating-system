import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  createStore,
  getAllStores,
  getStoreOwnerDashboard,
  submitOrUpdateRating,
} from "../controllers/store.controller.js";
import { storeOwner } from "../middleware/storeOwner.js";

const storeRouter = Router();

storeRouter.get("/getAllStores", auth, getAllStores);
storeRouter.post("/createStore", auth, admin, createStore);
storeRouter.post("/:id/rating", auth, submitOrUpdateRating);
storeRouter.get(
  "/getStoreDashboard",
  auth,
  storeOwner,
  getStoreOwnerDashboard
);

export default storeRouter;
