
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.currentUser.role)) {


            const error = appError.createError(401, "Unauthorized !", httpStatusText.FAIL);
            return next(error);
        } else
            next();
    }
}