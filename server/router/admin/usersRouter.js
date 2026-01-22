import express from "express";
import { getAllUsers, userStatusUpdate } from "../../controllers/admin/usersController.js";
import middlewareAdmin from "../../middlewares/middlewareAdmin.js";


const users = express.Router();

users.put("/admin/update/user/:userId/status", middlewareAdmin, userStatusUpdate);
users.get("/admin/get/users", middlewareAdmin, getAllUsers);

export default users;