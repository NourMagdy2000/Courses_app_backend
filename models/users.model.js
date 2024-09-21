const mongoose = require('mongoose');
const validator = require('validator');
const appRole = require('../utils/roles');
userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, "Email must be verifed !"] },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, enum: [appRole.ADMIN, appRole.USER], default: appRole.USER },
    phone: { type: Number, required: true },
    token: { type: String, required: true },
    avatar: { type: String ,default:"uploads/user.jpg",},
})
module.exports = mongoose.model('User', userSchema);                           