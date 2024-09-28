

// let { course } = require('../data/courses');
let course = require('../models/courses.model');
let { validationResult } = require('express-validator');
let httpStatusText = require('../utils/strings/httpStatusText');
const async_wrapper = require('../middleware/async_middleware');

let AppError = require('../utils/functions/appError');
const appError = require('../utils/functions/appError');




let getAllCourses = async_wrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 2;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await course.find({}, { "__v": false }).limit(limit).skip(skip);
    res.json({ "status": httpStatusText.SUCCESS, "data": { courses } });
})
// let getAllCourses = (req, res) => { res.json(courses) };

let getSingleCourse =
    async_wrapper(
        async (req, res, next) => {


            // const id = +req.params.courseId;
            // const selectedCourse = courses.find((course) => { return course.id === id })

            const selectedCourse = await course.findById(req.params.courseId);
            if (!selectedCourse) {

                const error = appError.createError(404, "Course not found !", httpStatusText.FAIL);
                // res.status(404).json({ "status": httpStatusText.FAIL, "data": { "course": " Course not found !" } }) 

                return next(error);
            }
            else res.json({ "status": httpStatusText.SUCCESS, "data": { selectedCourse } });
            //   try {} 
            // catch (err) { return res.status(400).json({ "status": httpStatusText.ERROR, "data": null, "message": err.message }) }
        });


// let getSingleCourse = (req, res) => {

//     const id = +req.params.courseId;
//     const selectedCourse = courses.find((course) => { return course.id === id })
//     if (!selectedCourse) { res.status(404).json({ msg: " Course not found !" }) }
//     else res.json(selectedCourse)

// };

let updateCourse = async_wrapper(
    async (req, res, next) => {

        let id = req.params.courseId;
        // let selectedCourse = courses.find((course) => { return course.id === id })

        await course.findByIdAndUpdate(id, { $set: { ...req.body } });
        let updatedCourse = await course.findById(id);
        if (!updatedCourse) {
            const error = appError.createError(404, " Course not found !", httpStatusText.FAIL);
            next(error);
        }
        else {
            // selectedCourse.title = req.body.title;
            // selectedCourse.price = req.body.price;
            // res.json({ "updatedCourse": selectedCourse, "msg": "course is updated successfully" });

            // selectedCourse = { ...selectedCourse, ...req.body };
            res.status(200).json({ "status": httpStatusText.SUCCESS, "data": { "updated course": updatedCourse } });

        }
    }



);

let createCourse = async_wrapper(async (req, res, next) => {
    const errors = validationResult(req);
    // if (!req.body.title || !req.body.price) {

    //     res.status(400).json({ msg: "One or all params not have been sent !" }) 
    // }
    // else {
    console.log(errors);
    if (errors.isEmpty()) {


        // res.status(400).json({ msg: "One or all params not have been sent !" })
        const newCourse = new course(req.body);
        await newCourse.save();
        return res.status(201).json({ "status": httpStatusText.SUCCESS, "data": { "new course": newCourse } });
    } else {

        const error = appError.createError(400, errors.array(), httpStatusText.FAIL);
        next(error);
    }

    // }
})

// let createCourse = (req, res) => {
//     const errors = validationResult(req);
//     // if (!req.body.title || !req.body.price) {

//     //     res.status(400).json({ msg: "One or all params not have been sent !" }) 
//     // }
//     // else {
//     console.log(errors);
//     if (errors.isEmpty()) {

//         courses.push({ id: courses.length + 1, ...req.body });
//         const course = { id: courses.length + 1, ...req.body };
//         res.status(201).json({ "createdCourse": course, "msg": "course is created successfully" });

//     } else {

//         return res.status(400).json(errors.array());
//         console.log(errors);
//     }

//     // }
// };
let deleteCourse = async_wrapper(async (req, res, next) => {

    let id = req.params.courseId;
    // let selectedCourse = courses.find((course) => { return course.id === id })
    const selectedCourse = await course.findById(req.params.courseId);
    if (!selectedCourse) {

        const error = appError.createError(404, "Course not found !", httpStatusText.FAIL);
        // res.status(404).json({ "status": httpStatusText.FAIL, "data": { "course": " Course not found !" } }) 

        return next(error);
    } else {
        const response = await course.deleteOne({ _id: id });
        // if (!deleteCourse) { res.status(404).json({ msg: " Course not found !" }) }

        // courses = courses.filter((course) => { return course.id !== id })
        return res.status(200).json({ "status": httpStatusText.SUCCESS, "msg": null });
    }



});


module.exports = { getAllCourses, getSingleCourse, updateCourse, createCourse, deleteCourse };
