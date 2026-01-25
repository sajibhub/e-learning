import express from "express";
import { orderProduct, adminUpdateOrder, adminGetAllTransactions } from "../../controllers/order/orderController.js";
import middlewareAdmin from "../../middlewares/middlewareAdmin.js";
import middlewareUser from "../../middlewares/middlewareUser.js";

const orderRouter = express.Router();

// --------------------- USER ROUTES ---------------------

// Place an order (course or product) - user must be authenticated
orderRouter.post("/order", middlewareUser, orderProduct);

// --------------------- ADMIN ROUTES ---------------------

// Update transaction status (completed/failed) - admin only
orderRouter.put("/admin/order/:transactionId/status", middlewareAdmin, adminUpdateOrder);

// Get all transactions with pagination and optional type filter - admin only
orderRouter.get("/admin/transactions", middlewareAdmin, adminGetAllTransactions);

export default orderRouter;
