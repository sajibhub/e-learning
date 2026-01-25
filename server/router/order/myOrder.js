import express from "express";
import { myOrders } from "../../controllers/order/myORderController.js";
import middlewareUser from "../../middlewares/middlewareUser.js";

const myOrderRouter = express.Router();

// --------------------- USER ROUTES ---------------------

// Get my orders
// Optional query params: ?type=course|product|all, ?page=1, ?limit=10
myOrderRouter.get("/my-orders", middlewareUser, myOrders);

export default myOrderRouter;
