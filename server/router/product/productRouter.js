import express from "express";
import { productCreate, productDelete, productDetailsGet, productGet, productUpdate } from "../../controllers/product/productController.js";

const productRouter = express.Router();

productRouter.post("/product/create", productCreate)
productRouter.get("/product/", productGet)
productRouter.get("/product/:productId", productDetailsGet)
productRouter.put("/product/update/:productId", productUpdate)
productRouter.delete("/product/delete/:productId", productDelete)

export default productRouter;