
const User = require('../models/users.model');
const httpStatusText = require('../utils/httpStatusText');
const async_wrapper = require('../middleware/async_middleware');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const genetateJWS = require('../utils/genertateJWS');






const getAllUsers = async_wrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 2;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { "__v": false, "password": false, "token": false }).limit(limit).skip(skip);
    res.status(200).json({ "status": httpStatusText.SUCCESS, "data": { users } });
})


const register = async_wrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, age, phone, role } = req.body;
    // const user = await User.create({firstName,lastName,email,password,age,phone});

    const oldUser = await User.findOne({ email });
    if (oldUser) {
        const error = appError.createError(404, "User already exists !", httpStatusText.FAIL);
        return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 6)

    //generate token
    let fileName = req.file.filename;
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, age, phone, role, avatar:fileName });
    const token = await genetateJWS({ email: newUser.email, id: newUser.id, role: newUser.role });
    newUser.token = token;
    await newUser.save();
    res.status(201).json({ "status": httpStatusText.SUCCESS, "data": { newUser } });
});


const login = async_wrapper(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        const error = appError.createError(404, "Please provide email and password !", httpStatusText.FAIL);
        return next(error);
    }

    const user = await User.findOne({ email });

    if (!user) {
        const error = appError.createError(500, "User not found !", httpStatusText.ERROR);
        return next(error);
    }
    const matchedPassword = await bcrypt.compare(password, user.password);

    if (user && matchedPassword) {
        const token = await genetateJWS({ email: user.email, id: user.id, role: user.role });
        user.token = token;
        await user.save();
        res.status(200).json({ "status": httpStatusText.SUCCESS, "data": { "token": user.token } });
    } else {
        const error = appError.createError(500, "Invalid credentials !", httpStatusText.FAIL);
        return next(error);
    }
})






module.exports = { getAllUsers, register, login }