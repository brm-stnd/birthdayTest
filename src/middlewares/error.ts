import httpStatus from 'http-status';
import { getRequestId, Http, logger } from '@hzn-one/commons';
import { Request, Response } from 'express';

import config from '@server/config/config';

const errorHandler = (err: any, req: Request, res: Response, _next): void => {
  let { statusCode = 500, message, isOperational = false } = err;

  if (config.APP_ENV === 'production' && !isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  logger(getRequestId(req), 'Error', req.body, err);

  res.status(statusCode).send(Http.response(false, message));
};

export { errorHandler };
