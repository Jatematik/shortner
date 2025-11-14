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
  const ownerId = res.locals.user.id;

  try {
    const shortLink = await getShortUrl(url);
    const newShortUrl = await Shortner.create({
      originalLink: url,
      shortLink,
      owner: ownerId,
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

export const getAllShortLinksByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ownerId = res.locals.user.id;

  try {
    const shortLinks = (await Shortner.find({ owner: ownerId })) || [];

    res.send(
      shortLinks.map((link) => ({
        id: link._id,
        originalLink: link.originalLink,
        shortLink: link.shortLink,
      }))
    );
  } catch (error) {
    next(error);
  }
};
