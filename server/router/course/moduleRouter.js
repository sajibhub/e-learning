import express from "express";
import {
  createModule,
  getAllModules,
  updateModule,
  deleteModule,
  courseList
} from "../../controllers/course/moduleController.js";
import middlewareAdmin from "../../middlewares/middlewareAdmin.js";

const moduleRouter = express.Router();

// --------------------- ADMIN ROUTES ---------------------

moduleRouter.get("/courses/list", middlewareAdmin, courseList);
// Create a new module
moduleRouter.post("/modules", middlewareAdmin, createModule);

// Get all modules (optional query: ?courseId=xxx)
moduleRouter.get("/modules", middlewareAdmin, getAllModules);

// Update module by ID
moduleRouter.put("/modules/:moduleId", middlewareAdmin, updateModule);

// Delete module by ID
moduleRouter.delete("/modules/:moduleId", middlewareAdmin, deleteModule);

export default moduleRouter;
