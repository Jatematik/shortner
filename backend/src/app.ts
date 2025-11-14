import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { errorHandler } from './middlewares/error-handler';
import shortnerRouter from './shortner/shortner.router';
import userRouter from './users/users.router';
import authMiddleware from './middlewares/auth';
import { requestLogger } from './middlewares/logger';
import { errorLogger } from 'express-winston';

const { PORT, MONGO_URL, FRONTEND_URL } = process.env;

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(userRouter);
app.use(authMiddleware);
app.use(shortnerRouter);

app.use(errorLogger);

app.use(errorHandler);

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL as string);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log('Started on', PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
