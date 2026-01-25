import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    productType: {
        type: String,
        required: true,
        enum: ["course", "product"]
    },
    email: {
        type: String,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["bkash", "nagad", "rocket"]
    },
    trxId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    payNumber: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false })

const TransactionModel = mongoose.model("transactions", TransactionSchema)

export default TransactionModel;