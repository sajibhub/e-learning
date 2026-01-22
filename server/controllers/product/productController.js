import path from "path";
import fs from "fs"

import ShopCategory from "../../models/shopCategoryModel.js";
import ShopModel from "../../models/shopModel.js";
import ProductUpload from "../../utils/productUpload.js";

const removeUploadedFiles = (files) => {
    for (const key in files) {
        files[key].forEach(file => {
            fs.unlink(file.path, (
                err) => {
                if (err) console.error(`Failed to delete file ${file.path}:`, err);
            });
        });
    }
}

export const productCreate = async (req, res) => {
    try {
        ProductUpload().fields([
            { name: "productImage", maxCount: 1 },
            { name: "productZipFile", maxCount: 1 },
        ])(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            if (!req.files?.productImage || !req.files?.productZipFile) {
                return res.status(400).json({
                    message: "Both product image and zip file are required.",
                });
            }

            const imageFile = req.files.productImage[0];
            const archiveFile = req.files.productZipFile[0];

            const { title, categoryId, price, details } = req.body;
            if (!title || !categoryId || !price || !details) {
                removeUploadedFiles(req.files);
                return res.status(400).json({
                    message: "All fields are required: title, categoryId, price, and details.",
                });
            }

            if (isNaN(price) || Number(price) <= 0) {
                removeUploadedFiles(req.files);
                return res.status(400).json({
                    message: "Price must be a positive number.",
                });
            }

            if (title.trim().length < 3) {
                removeUploadedFiles(req.files);
                return res.status(400).json({
                    message: "Title must be at least 3 characters long.",
                });
            }

            if (details.trim().length < 10) {
                removeUploadedFiles(req.files);
                return res.status(400).json({
                    message: "Details must be at least 10 characters long.",
                });
            }

            const findCategory = await ShopCategory.findById(categoryId);
            if (!findCategory) {
                removeUploadedFiles(req.files);
                return res.status(404).json({ message: "Category not found." });
            }

            const newProduct = await ShopModel.create({
                productTitle: title.trim(),
                productDetails: details.trim(),
                productImages: imageFile.path,
                productZipFile: archiveFile.path,
                productPrice: Number(price),
                category: categoryId,
            });

            return res.status(201).json({
                message: "Product created successfully.",
                product: newProduct,
            })

        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
            error: error.message,
        });
    }
};

export const productGet = async (req, res) => {
    try {
        const { categoryId, search, page = 1, limit = 10 } = req.query;

        const matchStage = {};

        if (categoryId) {
            matchStage.category = categoryId;
        }

        if (search) {
            matchStage.productTitle = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        // Aggregation pipeline
        const products = await ShopModel.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } }, 
            { $skip: skip },
            { $limit: Number(limit) },
            {
                $project: {
                    productTitle: 1,
                    productDetails: 1,
                    productPrice: 1,
                    productImage: {
                        $cond: [
                            { $gt: [{ $size: { $ifNull: ["$productImages", []] } }, 0] },
                            { $concat: [process.env.BACKEND, "/files/", { $arrayElemAt: ["$productImages", 0] }] },
                            null
                        ]
                    }
                }
            }
        ]);

        const total = await ShopModel.countDocuments(matchStage);

        return res.status(200).json({
            products,
            page: Number(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
};
