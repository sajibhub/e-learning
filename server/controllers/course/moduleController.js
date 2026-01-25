import mongoose from "mongoose";
import CourseModuleModel from "../../models/courseModuleModel.js";
import CourseModel from "../../models/courseModel.js";

export const courseList = async (req, res) => {
    try {
        const courses = await CourseModel.find({}).select("title _id").lean()

        return res.status(200).json({
            courses,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request."
        });
    }
};
// --------------------- CREATE MODULE ---------------------
export const createModule = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ message: "courseId and title are required" });
    }

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const findCourse = await CourseModel.findOne({_id:courseId}).select("_id").lean()
  if (!findCourse) {
  return res.status(400).json({
    success: false,
    message: "Course not found. Please check the course ID and try again."
  });
}


    const newModule = await CourseModuleModel.create({ courseId, title });

    return res.status(201).json({
      message: "Module created successfully",
      data: newModule
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --------------------- GET ALL MODULES ---------------------
export const getAllModules = async (req, res) => {
  try {
    const { courseId } = req.query;

    const filter = {};
    if (courseId && mongoose.isValidObjectId(courseId)) {
      filter.courseId = courseId;
    }

    const modules = await CourseModuleModel.find(filter).sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Modules fetched successfully",
      total: modules.length,
      data: modules
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// --------------------- UPDATE MODULE ---------------------
export const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, courseId } = req.body;

    if (!mongoose.isValidObjectId(moduleId)) {
      return res.status(400).json({ message: "Invalid moduleId" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (courseId && mongoose.isValidObjectId(courseId)) updateData.courseId = courseId;

    const updatedModule = await CourseModuleModel.findByIdAndUpdate(
      moduleId,
      updateData,
      { new: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.status(200).json({ message: "Module updated successfully", data: updatedModule });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --------------------- DELETE MODULE ---------------------
export const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    if (!mongoose.isValidObjectId(moduleId)) {
      return res.status(400).json({ message: "Invalid moduleId" });
    }

    const deletedModule = await CourseModuleModel.findByIdAndDelete(moduleId);

    if (!deletedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.status(200).json({ message: "Module deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
