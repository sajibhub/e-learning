import validator from "validator";
import ShopModel from "../../models/shopModel.js";
import CourseModel from "../../models/courseModel.js";
import TransactionModel from "../../models/transactionModel.js";

export const orderProduct = async (req, res) => {
    try {
        const { userId } = req;
        const { trxId, number, productId, productType, paymentMethod, email } = req.body;


        if (!trxId || !number || !productId || !productType || !paymentMethod) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isMongoId(productId)) {
            return res.status(400).json({ message: "Invalid productId" });
        }

        const validProductTypes = ["course", "product"];
        const validPaymentMethods = ["bkash", "nagad", "rocket"];

        if (!validProductTypes.includes(productType)) {
            return res.status(400).json({ message: "Invalid product type" });
        }

        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        if (productType === "product") {
            if (!email) {
                return res.status(400).json({ message: "Email is required for product purchase" });
            }
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }

        const findProduct =
            productType === "course"
                ? await CourseModel.findById(productId).select("_id").lean()
                : await ShopModel.findById(productId).select("_id").lean();

        if (!findProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existTrx = await TransactionModel.findOne({ trxId }).select("_id").lean();
        if (existTrx) {
            return res.status(409).json({ message: "Transaction ID already used" });
        }

        const transaction = await TransactionModel.create({
            userId,
            productId,
            productType,
            paymentMethod,
            trxId,
            payNumber: number,
            email: productType === "product" ? email : undefined
        });

        return res.status(201).json({
            message: "Order placed successfully",
            data: transaction
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing your request."
        });
    }
};

export const adminUpdateOrder = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status } = req.body;

        if (!transactionId || !status) {
            return res.status(400).json({
                message: "TransactionId (params) and status are required"
            });
        }

        if (!validator.isMongoId(transactionId)) {
            return res.status(400).json({
                message: "Invalid transactionId"
            });
        }

        if (!["completed", "failed", "pending"].includes(status)) {
            return res.status(400).json({
                message: "Status must be completed or failed"
            });
        }

        const transaction = await TransactionModel.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        const updateOrder = await TransactionModel.findByIdAndUpdate(
            transactionId,
            { status },
            { new: true }
        );

        if (!updateOrder) {
            return res.status(400).json({
                message: "Order update failed",
            });
        }
        return res.status(200).json({
            message: `Transaction marked as ${status}`,
            data: {
                _id: updateOrder._id,
                trxId: updateOrder.trxId,
                status: updateOrder.status
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const adminGetAllTransactions = async (req, res) => {
    try {
        // 🔹 query params with defaults
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;
        const { type, search } = req.query;

        // 🔹 match stage (filter)
        const matchStage = {};
        if (type && ["course", "product"].includes(type)) {
            matchStage.productType = type;
        }

        if (search && search.length === 1) {
            matchStage.trxId = {
                $regex: search,
                $options: "i"
            };
        }

        const transactions = await TransactionModel.aggregate([
            { $match: matchStage },
            {
                $addFields: {
                    statusOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$status", "pending"] }, then: 1 },
                                { case: { $eq: ["$status", "completed"] }, then: 2 },
                                { case: { $eq: ["$status", "failed"] }, then: 3 },
                            ],
                            default: 4
                        }
                    }
                }
            },
            { $sort: { statusOrder: 1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            // 🔹 Populate user
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },

            // 🔹 Lookup courses
            {
                $lookup: {
                    from: "courses",
                    localField: "productId",
                    foreignField: "_id",
                    as: "course"
                }
            },

            // 🔹 Lookup shops
            {
                $lookup: {
                    from: "shops",
                    localField: "productId",
                    foreignField: "_id",
                    as: "shop"
                }
            },

            // 🔹 Combine product info
            {
                $addFields: {
                    product: {
                        $cond: [
                            { $eq: ["$productType", "course"] },
                            { $arrayElemAt: ["$course", 0] },
                            { $arrayElemAt: ["$shop", 0] }
                        ]
                    }
                }
            },

            // 🔹 Project final fields
            {
                $project: {
                    trxId: 1,
                    productType: 1,
                    paymentMethod: 1,
                    status: 1,
                    payNumber: 1,
                    email: 1,
                    createdAt: 1,

                    "user._id": 1,
                    "user.name": 1,
                    "user.email": 1,

                    // Fix title & price based on type
                    "product.title": {
                        $cond: [
                            { $eq: ["$productType", "course"] },
                            "$product.title",
                            "$product.productTitle"
                        ]
                    },
                    "product.price": {
                        $cond: [
                            { $eq: ["$productType", "course"] },
                            "$product.coursePrice",
                            "$product.productPrice"
                        ]
                    },
                }
            },


        ]);

        // 🔹 total count for pagination
        const total = await TransactionModel.countDocuments(matchStage);

        return res.status(200).json({
            message: "All transactions fetched successfully",
            page,
            pages: Math.ceil(total / limit),
            data: transactions
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
