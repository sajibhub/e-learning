import express from "express";

import { AdminLogin, adminLogout, adminUpdateProfile, getAdminProfile } from "../../controllers/admin/adminAuthController.js";
import middlewareAdmin from "../../middlewares/middlewareAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/admin/login", AdminLogin);
adminRouter.post("/admin/logout", middlewareAdmin, adminLogout);

adminRouter.get("/admin/profile", middlewareAdmin, getAdminProfile);
adminRouter.put("/admin/profile/update", middlewareAdmin, adminUpdateProfile);

export default adminRouter; 