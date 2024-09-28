

const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const appError = require('../utils/functions/appError');
    const httpStatusText = require('../utils/strings/httpStatusText');
    const authHeader = req.headers['authorization'] || req.headers['Authorization']

    if (!authHeader) {

        const error = appError.createError(401, "Token is required !", httpStatusText.FAIL)
        return next(error);
    }

    const token = authHeader.split(' ')[1]
    console.log(token);
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    }


    catch (err) {
        const error = appError.createError(401, "Token is invalid !", httpStatusText.ERROR)
        return next(err)
    }

}

module.exports = verifyToken;