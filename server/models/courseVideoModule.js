import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseModules",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });

const VideoModel = mongoose.model("videos", VideoSchema);

export default VideoModel;
