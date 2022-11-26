"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../loggers/console");
function RequestConsoleLogger(req, res, next) {
    const startTime = new Date().getMilliseconds();
    req.on('end', () => {
        const endTime = new Date().getMilliseconds();
        if (res.statusCode.toString().startsWith('2') || res.statusCode === 304) {
            (0, console_1.ok)(`${req.method} ${req.path} ${res.statusCode} - ${endTime - startTime}ms`);
        }
        else {
            (0, console_1.warn)(`${req.method} ${req.path} ${res.statusCode} - ${endTime - startTime}ms`);
        }
    });
    next();
}
exports.default = RequestConsoleLogger;
