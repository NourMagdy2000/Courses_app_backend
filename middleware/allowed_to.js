
const appError = require('../utils/functions/appError');
const httpStatusText = require('../utils/strings/httpStatusText');

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.currentUser.role)) {


            const error = appError.createError(401, "Unauthorized !", httpStatusText.FAIL);
            return next(error);
        } else
            next();
    }
}