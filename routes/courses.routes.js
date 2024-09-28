


const express = require("express");
const coursesController = require('../controllers/courses.controller');
const router = express.Router();
const { addCourseValidator } = require('../middleware/courses.middleware');
const verifyToken = require("../middleware/verify_token");
const allowed_to = require("../middleware/allowed_to");

const appRole = require('../utils/strings/roles');

router.route('/').get(verifyToken, coursesController.getAllCourses).post(
    addCourseValidator(), verifyToken, allowed_to(appRole.ADMIN),
    coursesController.createCourse);


// get single course

router.route('/:courseId').
    get(verifyToken, coursesController.getSingleCourse).
    patch(verifyToken, allowed_to(appRole.ADMIN), coursesController.updateCourse).
    delete(verifyToken, allowed_to(appRole.ADMIN), coursesController.deleteCourse);


// post new courses


// update courses



// delete courses


module.exports = router;