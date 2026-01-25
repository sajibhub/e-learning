import express from "express";
import {
  createVideo,
  getAllVideos,
  updateVideo,
  deleteVideo
} from "../../controllers/course/videoController.js";
import middlewareAdmin from "../../middlewares/middlewareAdmin.js";

const videoRouter = express.Router();

// --------------------- ADMIN ROUTES ---------------------

// Create a new video
videoRouter.post("/videos", middlewareAdmin, createVideo);

// Get all videos (optional query: ?courseId=xxx&moduleId=yyy)
videoRouter.get("/videos", middlewareAdmin, getAllVideos);

// Update video by ID
videoRouter.put("/videos/:videoId", middlewareAdmin, updateVideo);

// Delete video by ID
videoRouter.delete("/videos/:videoId", middlewareAdmin, deleteVideo);

export default videoRouter;
