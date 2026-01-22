import express from "express";
import { productCreate, productGet } from "../../controllers/product/productController.js";

const productRouter = express.Router();

productRouter.post("/product/create", productCreate)
productRouter.get("/product/", productGet)

export default productRouter;