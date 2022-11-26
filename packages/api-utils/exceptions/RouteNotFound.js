"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../http");
class RouteNotFound extends Error {
    statusCode;
    constructor(method, path) {
        super(`Cannot ${method} ${path}`);
        this.statusCode = http_1.StatusCode.NOT_FOUND;
    }
}
exports.default = RouteNotFound;
