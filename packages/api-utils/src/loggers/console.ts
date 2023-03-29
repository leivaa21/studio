import { Colors } from "./colors";

function formatTag(text: string, color: string) {
  return `[${color}${text}${Colors.reset}]`;
}

export function info(msg: string) {
  const tag = formatTag('INFO', Colors.cyan);
  console.info(`${tag} ${msg}`)
}
export function log(msg: string) {
		const tag = formatTag('LOG', Colors.orange);
    console.info(`${tag} ${msg}`)
}
export function ok(msg: string) {
		const tag = formatTag('OK', Colors.green);
    console.info(`${tag} ${msg}`)
}
export function error(msg: string) {
		const tag = formatTag('ERROR', Colors.red);
    console.info(`${tag} ${msg}`)
}
export function warn(msg: string) {
		const tag = formatTag('WARN', Colors.yellow);
    console.info(`${tag} ${msg}`)
}

export const consoleLogger = {
  info,
  log,
  error,
  warn,
  ok
}
