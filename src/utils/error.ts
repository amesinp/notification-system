import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  status: number;
  data: object;

  constructor(status: number, message: string, data?: object) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function defaultErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).send({ error: err.message, data: err.data });
    return;
  }

  res.status(500).send({ error: 'An error occurred' });
}
