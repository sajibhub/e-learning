import express from "express";

import {
    deleteProductCategory,
    getAllProductCategories,
    productCategoryCreate,
    updateProductCategory
} from "../../controllers/product/productCategoryController.js";
import middlewareAdmin from "../../middlewares/middlewareAdmin.js";

const productCategoryRouter = express.Router();

productCategoryRouter.post("/product-category/create", middlewareAdmin, productCategoryCreate);
productCategoryRouter.get("/product-category",  getAllProductCategories);
productCategoryRouter.put("/product-category/update/:id", middlewareAdmin, updateProductCategory);
productCategoryRouter.delete("/product-category/delete/:id", middlewareAdmin, deleteProductCategory);

export default productCategoryRouter;