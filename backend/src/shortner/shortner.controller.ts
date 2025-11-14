import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { getShortUrl } from './shortner.service';
import Shortner from './shortner.model';
import { transformError } from '../helpers/transform-error';
import BadRequestError from '../errors/bad-request-error';

export const createShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.body.url;

  try {
    const shortLink = await getShortUrl(url);
    const newShortUrl = await Shortner.create({
      originalLink: url,
      shortLink,
    });

    res.status(201).send({
      id: newShortUrl._id,
      originalLink: newShortUrl.originalLink,
      shortLink: newShortUrl.shortLink,
    });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    next(error);
  }
};
