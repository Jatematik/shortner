import 'dotenv/config';
import express from 'express';

import { errorHandler } from './middlewares/error-handler';
import shortnerRouter from './shortner/shortner.router';

const { PORT } = process.env;

const app = express();
app.use(express.json());

app.use(errorHandler);

app.use(shortnerRouter);

const run = async () => {
  try {
    app.listen(PORT, () => {
      console.log('Started on', PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
