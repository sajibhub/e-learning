import mongoose from "mongoose";

const shopCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
},{timestamps: true,versionKey:false});

const ShopCategory = mongoose.model("ShopCategory", shopCategorySchema);

export default ShopCategory;