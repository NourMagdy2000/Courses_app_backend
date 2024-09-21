
const{body}=require("express-validator")

const addCourseValidator=()=>[body('title').notEmpty().withMessage("title must not be empty !"),
    body('title').isLength({ min: 2 }).withMessage("title must not be less than 2 digits !"),
    body('price').notEmpty().withMessage("price must not be empty !"),
    body('price').isLength({ min: 2 }).withMessage("price must not be less than 2 digits !")];



    module.exports={
        addCourseValidator};