import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils';

/**
 * Basic logging middleware to track the requests made to the service
 * @param req
 * @param _
 * @param next
 */
export const loggingMiddleware = (req: Request, _: Response, next: NextFunction) => {
  Logger.info(`${req.ip} ${req.headers['user-agent']} ${req.method} ${req.url}`);
  next();
};
