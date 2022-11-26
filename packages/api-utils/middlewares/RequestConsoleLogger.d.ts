import { NextFunction, Request, Response } from "express";
declare function RequestConsoleLogger(req: Request, res: Response, next: NextFunction): void;
export default RequestConsoleLogger;
