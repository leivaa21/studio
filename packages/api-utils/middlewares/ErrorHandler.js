"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../http");
function ErrorHandler(err, req, res, next) {
    let data = {
        message: err.message,
        status: http_1.StatusCode.INTERNAL_ERROR,
        type: 'Internal Server Error',
    };
    if (err.statusCode) {
        const httpErr = err;
        data.status = httpErr.statusCode;
        data.type = httpErr.constructor.name.split(/(?=[A-Z])/).join(' ');
    }
    res.status(data.status).json(data).end();
}
exports.default = ErrorHandler;
