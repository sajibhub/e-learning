import mongoose from "mongoose";

const CourseModuleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true
  },
  title: {
    type: String,
    required: true
  }
}, { timestamps: true, versionKey: false });

const CourseModuleModel = mongoose.model("courseModules", CourseModuleSchema);

export default CourseModuleModel;
