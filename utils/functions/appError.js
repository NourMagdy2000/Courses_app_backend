class AppError extends Error {
    constructor() {
        super();
    }


    createError(statusCode, message ,statusText) {
    this.message=message;
    this.statusCode=statusCode;
    this.statusText=statusText;
    return this;
    }
}

module.exports = new AppError();