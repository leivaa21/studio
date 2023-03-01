import { Colors } from "./colors";

function formatTag(text: string, color: string) {
  return `[${color}${text}${Colors.reset}]`;
}

function info(msg: string) {
  const tag = formatTag('INFO', Colors.cyan);

  console.info(`${tag} ${msg}`)
}
function log(msg: string) {
		const tag = formatTag('LOG', Colors.orange);
    console.info(`${tag} ${msg}`)
}
function ok(msg: string) {
		const tag = formatTag('OK', Colors.green);
    console.info(`${tag} ${msg}`)

}
function error(msg: string) {
		const tag = formatTag('ERROR', Colors.red);
    console.info(`${tag} ${msg}`)
}
function warn(msg: string) {
		const tag = formatTag('WARN', Colors.yellow);
    console.info(`${tag} ${msg}`)
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