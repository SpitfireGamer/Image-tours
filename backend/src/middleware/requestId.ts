import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

export const requestIdMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  req.requestId = (req.headers["x-request-id"] as string) || uuidv4();
  next();
};
