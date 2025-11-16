import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

export const requestLogger = expressWinston.logger({
  transports: [
    // //для локальной разработки
    // new winston.transports.Console({
    //   format: winston.format.simple(),
    // }),
    // //для прода
    // new winston.transports.File({
    //   filename: 'request.log',
    // }),
    new winston.transports.DailyRotateFile({
      filename: 'request-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      maxFiles: 14,
      zippedArchive: true,
    }),
  ],
  format: winston.format.json(),
});
export const errorLogger = expressWinston.errorLogger({
  transports: [
    // new winston.transports.File({
    //   filename: 'errors.log',
    // }),
    new winston.transports.DailyRotateFile({
      filename: 'errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
    }),
  ],
  format: winston.format.json(),
});
