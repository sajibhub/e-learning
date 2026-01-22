import express from 'express';
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourseById,
    updateCourse
} from '../../controllers/course/courseController.js';
import middlewareAdmin from '../../middlewares/middlewareAdmin.js';

const courseRouter = express.Router();

courseRouter.post('/course/create', middlewareAdmin, createCourse)
courseRouter.get('/course/courses', getAllCourses)
courseRouter.get('/course/:id', getCourseById)
courseRouter.delete('/course/delete/:id', middlewareAdmin, deleteCourse)
courseRouter.put('/course/update/:id', middlewareAdmin, updateCourse)

export default courseRouter