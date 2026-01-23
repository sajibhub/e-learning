import fs from "fs"
import validator from "validator"

import ShopCategory from "../../models/shopCategoryModel.js";
import ShopModel from "../../models/shopModel.js";
import ProductUpload from "../../utils/productUpload.js";
import path from "path";

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
                    productImages: {$concat:[process.env.BACKEND,'/',"$productImages"]}
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

export const productDetailsGet = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!validator.isMongoId(productId)) {
            return res.status(400).json({
                message: "Invalid product ID."
            })
        }


        const product = await ShopModel.findById(productId).lean()

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const productData = {
            productTitle: product.productTitle,
            productDetails: product.productDetails,
            productPrice: product.productPrice,
            productImages: product.productImages ? `${process.env.BACKEND}/${product.productImages}` : null,
        };

        return res.status(200).json({ product: productData });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
};

export const productUpdate = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!validator.isMongoId(productId)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        ProductUpload().fields([
            { name: "productImage", maxCount: 1 },
            { name: "productZipFile", maxCount: 1 }
        ])(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const { title, categoryId, price, details } = req.body;

            if (
                !title &&
                !categoryId &&
                !price &&
                !details &&
                (!req.files || Object.keys(req.files).length === 0)
            ) {
                removeUploadedFiles(req.files);
                return res.status(400).json({
                    message: "At least one field is required to update.",
                });
            }

            const updateData = {};

            // ✅ Title validation
            if (title) {
                if (title.trim().length < 3) {
                    removeUploadedFiles(req.files);
                    return res.status(400).json({
                        message: "Title must be at least 3 characters long.",
                    });
                }
                updateData.productTitle = title.trim();
            }

            // ✅ Details validation
            if (details) {
                if (details.trim().length < 10) {
                    removeUploadedFiles(req.files);
                    return res.status(400).json({
                        message: "Details must be at least 10 characters long.",
                    });
                }
                updateData.productDetails = details.trim();
            }

            // ✅ Price validation
            if (price) {
                const numericPrice = Number(price);

                if (isNaN(numericPrice)) {
                    removeUploadedFiles(req.files);
                    return res.status(400).json({
                        message: "Price must be a valid number.",
                    });
                }

                if (numericPrice <= 0) {
                    removeUploadedFiles(req.files);
                    return res.status(400).json({
                        message: "Price must be greater than 0.",
                    });
                }

                updateData.productPrice = numericPrice;
            }

            // ✅ Category validation
            if (categoryId) {
                if (!validator.isMongoId(categoryId)) {
                    removeUploadedFiles(req.files);
                    return res.status(400).json({
                        message: "Invalid category ID.",
                    });
                }

                const findCategory = await ShopCategory.findById(categoryId).select("_id");
                if (!findCategory) {
                    removeUploadedFiles(req.files);
                    return res.status(400).json({
                        message: "Category not found.",
                    });
                }

                updateData.categoryId = categoryId;
            }

            const findProduct = await ShopModel.findById(productId).select("productImage productZipFile");
            // ✅ File handling
            if (req.files?.productImage) {
                updateData.productImages = req.files.productImage[0].path;
                try {
                    if (findProduct.productImages) {
                        fs.unlinkSync(process.cwd() + findProduct.productImages);
                    }
                } catch (error) {

                }
            }

            if (req.files?.productZipFile) {
                updateData.productZipFile = req.files.productZipFile[0].path;
            }

            const updatedProduct = await ShopModel.findByIdAndUpdate(
                productId,
                { $set: updateData },
                { new: true }
            );

            if (!updatedProduct) {
                removeUploadedFiles(req.files);
                return res.status(404).json({
                    message: "Product not found.",
                });
            }

            return res.status(200).json({
                message: "Product updated successfully.",
                product: {
                    _id:updatedProduct._id,
                    productTitle: updatedProduct.productTitle,
                    productDetails: updatedProduct.productDetails,
                    productPrice: updatedProduct.productPrice,
                    productImages: updatedProduct.productImages ? `${process.env.BACKEND}/${updatedProduct.productImages}` : null,
                },
            });
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
};

export const productDelete = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!validator.isMongoId(productId)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        const deletedProduct = await ShopModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        return res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
}