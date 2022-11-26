import { NextFunction, Request, Response } from "express";
import { ok, warn } from "../loggers/console";

function RequestConsoleLogger(req: Request, res: Response, next: NextFunction) {

  const startTime = new Date().getMilliseconds();

  req.on('end', () => {
    const endTime = new Date().getMilliseconds();
    if (res.statusCode.toString().startsWith('2') || res.statusCode === 304) {
      ok(`${req.method} ${req.path} ${res.statusCode} - ${endTime - startTime}ms`)    
    }
    else {
      warn(`${req.method} ${req.path} ${res.statusCode} - ${endTime - startTime}ms`)
    }
  })

  next();
}

export default RequestConsoleLogger;