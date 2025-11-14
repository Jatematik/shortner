import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/error-handler';
import shortnerRouter from './shortner/shortner.router';
import userRouter from './users/users.router';
import authMiddleware from './middlewares/auth';

const { PORT, MONGO_URL } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(errorHandler);

app.use(userRouter);
app.use(authMiddleware);
app.use(shortnerRouter);

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
