import mongoose from "mongoose";
import VideoModel from "../../models/courseVideoModule.js";

// --------------------- CREATE VIDEO ---------------------
export const createVideo = async (req, res) => {
  try {
    const { courseId, moduleId, title, videoUrl } = req.body;

    if (!courseId || !moduleId || !title || !videoUrl) {
      return res.status(400).json({ message: "courseId, moduleId, title, and videoUrl are required" });
    }

    if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(moduleId)) {
      return res.status(400).json({ message: "Invalid courseId or moduleId" });
    }

    const newVideo = await VideoModel.create({ courseId, moduleId, title, videoUrl });

    return res.status(201).json({
      message: "Video created successfully",
      data: newVideo
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --------------------- GET ALL VIDEOS ---------------------
export const getAllVideos = async (req, res) => {
  try {
    const { courseId, moduleId } = req.query;

    const filter = {};
    if (courseId && mongoose.isValidObjectId(courseId)) filter.courseId = new mongoose.Types.ObjectId(courseId);
    if (moduleId && mongoose.isValidObjectId(moduleId)) filter.moduleId = new mongoose.Types.ObjectId(moduleId);

    const videos = await VideoModel.find(filter).sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Videos fetched successfully",
      total: videos.length,
      data: videos
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --------------------- UPDATE VIDEO ---------------------
export const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, courseId, moduleId, videoUrl } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ message: "Invalid videoId" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (courseId && mongoose.isValidObjectId(courseId)) updateData.courseId = courseId;
    if (moduleId && mongoose.isValidObjectId(moduleId)) updateData.moduleId = moduleId;
    if (videoUrl) updateData.videoUrl = videoUrl;

    const updatedVideo = await VideoModel.findByIdAndUpdate(videoId, updateData, { new: true });

    if (!updatedVideo) return res.status(404).json({ message: "Video not found" });

    return res.status(200).json({ message: "Video updated successfully", data: updatedVideo });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --------------------- DELETE VIDEO ---------------------
export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
      return res.status(400).json({ message: "Invalid videoId" });
    }

    const deletedVideo = await VideoModel.findByIdAndDelete(videoId);

    if (!deletedVideo) return res.status(404).json({ message: "Video not found" });

    return res.status(200).json({ message: "Video deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
