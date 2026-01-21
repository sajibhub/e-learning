import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: null,
    },
    address: {
       type: String,
       default: null,
    },
    dob: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "banned"],
        default: "active",
    }
}, { timestamps: true ,versionKey: false });

const userModel = mongoose.model("users", userSchema);

export default userModel;