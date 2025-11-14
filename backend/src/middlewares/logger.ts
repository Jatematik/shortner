import winston from 'winston';
import expressWinston from 'express-winston';

export const requestLogger = expressWinston.logger({
  transports: [
    //для локальной разработки
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    //для прода
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'errors.log',
    }),
  ],
  format: winston.format.json(),
});
