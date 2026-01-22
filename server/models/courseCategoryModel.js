import mongoose from "mongoose";

const courseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
},{timestamps: true,versionKey:false});

const CourseCategory = mongoose.model("CourseCategory", courseCategorySchema);

export default CourseCategory;