import { NextFunction, Request, Response } from "express";
declare function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void;
export default ErrorHandler;
