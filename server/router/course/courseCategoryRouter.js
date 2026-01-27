import express from 'express';
import {
    createCourseCategory,
    deleteCourseCategory,
    getAllCourseCategories,
    updateCourseCategory
} from '../../controllers/course/courseCategoryController.js';
import middlewareAdmin from '../../middlewares/middlewareAdmin.js';

const courseCategoryRouter = express.Router();

courseCategoryRouter.post('/course-category/added', middlewareAdmin, createCourseCategory)
courseCategoryRouter.get('/course-category', getAllCourseCategories)
courseCategoryRouter.delete('/course-category/delete/:id', middlewareAdmin, deleteCourseCategory)
courseCategoryRouter.put('/course-category/update/:id', middlewareAdmin, updateCourseCategory)

export default courseCategoryRouter;