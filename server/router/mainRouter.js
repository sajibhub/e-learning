import express from "express";

import userRouter from "./userRouter.js";
import adminRouter from "./adminRouter.js";

const mainRouter = express.Router();

mainRouter.use(userRouter)
mainRouter.use(adminRouter)

export default mainRouter;