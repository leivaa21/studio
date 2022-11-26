"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.warn = exports.error = exports.log = exports.info = void 0;
function info(msg) {
    console.info(`[INFO] ${msg}`);
}
exports.info = info;
function log(msg) {
    console.log(`[LOG] ${msg}`);
}
exports.log = log;
function ok(msg) {
    console.log(`[OK] ${msg}`);
}
exports.ok = ok;
function error(msg) {
    console.error(`[ERROR] ${msg}`);
}
exports.error = error;
function warn(msg) {
    console.warn(`[WARN] ${msg}`);
}
exports.warn = warn;
const consoleLogger = {
    info,
    log,
    error,
    warn,
    ok
};
exports.default = consoleLogger;
