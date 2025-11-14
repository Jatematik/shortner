import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import User from './users.model';
import { transformError } from '../helpers/transform-error';
import BadRequestError from '../errors/bad-request-error';
import { ErrorCodes } from '../constants/error-codes';
import Conflict from '../errors/conflict-error';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;

  try {
    const newUser = await User.create(user);

    // token

    res.status(201).send({ id: newUser._id });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    if ((error as Error).message.startsWith(ErrorCodes.unique)) {
      return next(new Conflict('User with this email already exists'));
    }

    next(error);
  }
};
