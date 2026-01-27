import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true
    },
    courseDetails: {
        type: String,
        default: null,
    },
    coursePrice: {
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseCategory",
        required: true,
    }
}, { timestamps: true, versionKey: false });

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;