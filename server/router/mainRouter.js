import express from "express";

import userRouter from "./userRouter.js";
import users from "./admin/usersRouter.js";
import adminRouter from "./admin/adminRouter.js";
import courseCategoryRouter from "./course/courseCategoryRouter.js";
import courseRouter from "./course/courseRouter.js";
import productCategoryRouter from "./product/productCategoryRouter.js";
import productRouter from "./product/productRouter.js";

const mainRouter = express.Router();

mainRouter.use(userRouter)
mainRouter.use(adminRouter)
mainRouter.use(users)
mainRouter.use(courseCategoryRouter)
mainRouter.use(courseRouter)
mainRouter.use(productCategoryRouter)
mainRouter.use(productRouter)

export default mainRouter;