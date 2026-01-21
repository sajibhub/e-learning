import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: null,
    }
}, { timestamps: true ,versionKey: false });

const adminModel = mongoose.model("admins", adminSchema);

export default adminModel;