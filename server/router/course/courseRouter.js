import express from 'express';
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourseById,
    getCourseStructure,
    updateCourse
} from '../../controllers/course/courseController.js';
import middlewareAdmin from '../../middlewares/middlewareAdmin.js';
import middlewareUser from '../../middlewares/middlewareUser.js';

const courseRouter = express.Router();

courseRouter.post('/course/create', middlewareAdmin, createCourse)
courseRouter.get('/course/courses', getAllCourses)
courseRouter.get('/course/:id', getCourseById)
courseRouter.delete('/course/delete/:id', middlewareAdmin, deleteCourse)
courseRouter.put('/course/update/:id', middlewareAdmin, updateCourse)

courseRouter.get("/courses/:courseId/structure", middlewareUser, getCourseStructure);


export default courseRouter