import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    productTitle: {
        type: String,
        required: true,
        trim: true,
    },
    productDetails: {
        type: String,
        default: null,
    },
    productImages: {
        type: String,
        default: null,
    },
    productZipFile: {
        type: String,
        default: null,
    },
    productPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopCategory",
        required: true,
    }
}, { timestamps: true, versionKey: false });

const ShopModel = mongoose.model("Shop", shopSchema);

export default ShopModel;