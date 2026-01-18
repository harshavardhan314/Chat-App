import express from "express";
import {
  signup,
  login,
  updateProfile,
  checkauth,
} from "../controllers/UserControllers.js";
import { authenticate } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/updateProfile", authenticate, updateProfile);
userRouter.get("/check", authenticate, checkauth);

export default userRouter;
