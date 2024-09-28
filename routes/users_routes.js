const httpStatusText = require('../utils/strings/httpStatusText')

const verifyToken = require('../middleware/verify_token');
const multer = require('multer');
const passport = require('passport');
const diskStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    }, filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const imageName = 'user-' + Date.now() + '.' + ext;
        cb(null, imageName)
    }
})

const typeFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image" || file.mimetype.split("/")[0].includes("image")) {
        cb(null, true);
    } else {
        const appError = require('../utils/functions/appError');
        const httpStatusText = require('../utils/strings/httpStatusText');
        const error = appError.createError(500, "Please upload only images.", httpStatusText.ERROR);
        cb(error, false);
    }
}
const upload = multer({ storage: diskStorage, fileFilter: typeFilter });
const express = require("express");
const usersController = require('../controllers/users.controllers');
const { body } = require('express-validator');
const router = express.Router();


router.route('/').get(verifyToken, usersController.getAllUsers);

router.route('/register').post(upload.single('avatar'), usersController.register);

router.route('/login').post(usersController.login);

router.get("/socialLogin/success", usersController.socialLogin, passport.authenticate('google', { scope: ['profile', 'email'] }));


////failed case route
router.get("/socialLogin/failed", asyncHandler(async (req, res) => {
    res.status(401).json({
        status: httpStatusText.FAIL,
        message: "Login failed", data: null
    })
}));

///// auth
router.get("/auth/google", passport.authenticate("google", ["profile", "email"]));

//// callback
router.get("/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/socialLogin/success",
        failureRedirect: "/socialLogin/failed"
    })
);
module.exports = router;    