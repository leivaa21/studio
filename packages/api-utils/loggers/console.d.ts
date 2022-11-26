declare function info(msg: string): void;
declare function log(msg: string): void;
declare function ok(msg: string): void;
declare function error(msg: string): void;
declare function warn(msg: string): void;
declare const consoleLogger: {
    info: typeof info;
    log: typeof log;
    error: typeof error;
    warn: typeof warn;
    ok: typeof ok;
};
export { info, log, error, warn, ok };
export default consoleLogger;
