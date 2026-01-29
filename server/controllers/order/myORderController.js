import mongoose from "mongoose";
import dotenv from "dotenv"
import TransactionModel from "../../models/transactionModel.js";

dotenv.config()

export const myOrders = async (req, res) => {
  try {
    const { userId } = req; // from auth middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 query params with defaults
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    // 🔹 type filter (case-insensitive)
    let type = (req.query.type || "all").toLowerCase();

    // 🔹 match conditions
    const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
    if (type === "course" || type === "product") {
      matchStage.productType = type;
    }

    // 🔹 aggregation to join courses and shop products
    const orders = await TransactionModel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "courses",
          localField: "productId",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $lookup: {
          from: "shops",
          localField: "productId",
          foreignField: "_id",
          as: "shop"
        }
      },

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

      {
        $project: {
          trxId: 1,
          productType: 1,
          status: 1,
          paymentMethod: 1,
          payNumber: 1,
          email: 1,
          createdAt: 1,
          "product._id": 1,
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
          "product.image": {
            $cond: [
              { $eq: ["$productType", "course"] },

              {
                $cond: [
                  { $ifNull: ["$product.image", false] },
                  {
                    $concat: [
                      process.env.BACKEND,
                      "/images/",
                      "$product.image"
                    ]
                  },
                  null
                ]
              },

              {
                $cond: [
                  { $ifNull: ["$product.productImages", false] },
                  {
                    $concat: [
                      process.env.BACKEND,
                      "/",
                      "$product.productImages"
                    ]
                  },
                  null
                ]
              }
            ]
          }
        }
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    // 🔹 total for pagination
    const total = await TransactionModel.countDocuments(matchStage);

    return res.status(200).json({
      message: "My orders fetched successfully",
      totalPages: Math.ceil(total / limit),
      data: orders
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
