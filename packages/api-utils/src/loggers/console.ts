
function info(msg: string) {
  console.info(`[INFO] ${msg}`)
}
function log(msg: string) {
  console.log(`[LOG] ${msg}`)
}
function ok(msg: string) {
  console.log(`[OK] ${msg}`)
}
function error(msg: string) {
  console.error(`[ERROR] ${msg}`)
}
function warn(msg: string) {
  console.warn(`[WARN] ${msg}`)
}



const consoleLogger = {
  info,
  log,
  error,
  warn,
  ok
}

export {
  info,
  log,
  error,
  warn,
  ok
};

export default consoleLogger;