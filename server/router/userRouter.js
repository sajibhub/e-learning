import express from "express";
import {
    userAccountCreate,
    userLogin,
    userLogout
} from "../controllers/users/userAuthController.js";
import { getUserProfile, userUpdateProfile } from "../controllers/users/profileController.js";
import middlewareUser from "../middlewares/middlewareUser.js";

const userRouter = express.Router();

userRouter.post("/user/auth/register", userAccountCreate)
userRouter.post("/user/auth/login", userLogin)
userRouter.get("/user/auth/logout", middlewareUser, userLogout)

userRouter.get("/user/profile", middlewareUser, getUserProfile)
userRouter.put("/user/profile/update", middlewareUser, userUpdateProfile)

export default userRouter;