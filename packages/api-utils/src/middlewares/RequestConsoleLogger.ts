import { NextFunction, Request, Response } from "express";
import { ok, warn } from "../loggers/console";

function RequestConsoleLogger(req: Request, res: Response, next: NextFunction) {

  const startTime = new Date().getTime();

  res.on('finish', () => {
    const endTime = new Date().getTime();
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