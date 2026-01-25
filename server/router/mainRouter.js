import express from "express";

import userRouter from "./userRouter.js";
import users from "./admin/usersRouter.js";
import adminRouter from "./admin/adminRouter.js";
import courseCategoryRouter from "./course/courseCategoryRouter.js";
import courseRouter from "./course/courseRouter.js";
import productCategoryRouter from "./product/productCategoryRouter.js";
import productRouter from "./product/productRouter.js";
import orderRouter from "./order/orderRouter.js";
import myOrderRouter from "./order/myOrder.js";
import moduleRouter from "./course/moduleRouter.js";
import videoRouter from "./course/videoRorter.js";

const mainRouter = express.Router();

mainRouter.use(userRouter)
mainRouter.use(adminRouter)
mainRouter.use(users)
mainRouter.use(courseCategoryRouter)
mainRouter.use(courseRouter)
mainRouter.use(productCategoryRouter)
mainRouter.use(productRouter)
mainRouter.use(orderRouter)
mainRouter.use(myOrderRouter)
mainRouter.use(moduleRouter)
mainRouter.use(videoRouter)

export default mainRouter;