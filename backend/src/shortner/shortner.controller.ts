import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { getShortUrl } from './shortner.service';
import Shortner from './shortner.model';
import { transformError } from '../helpers/transform-error';
import BadRequestError from '../errors/bad-request-error';
import ForbiddenError from '../errors/forbidden-error';
import NotFoundError from '../errors/not-found-error';

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

export const updateShortLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const url = req.body.url;
  const ownerId = res.locals.user.id;

  try {
    const currentShortLink = await Shortner.findById(id).orFail();

    if (!currentShortLink.checkOwner(ownerId)) {
      return next(new ForbiddenError('You have no access to this resource'));
    }
    const shortLink = await getShortUrl(url);

    await currentShortLink.updateOne({
      originalLink: url,
      shortLink,
    });
    await currentShortLink.save();

    res.send({ id, shortLink, originalLink: url });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Invalid ID'));
    }

    if (error instanceof MongooseError.DocumentNotFoundError) {
      return next(new NotFoundError('Short link not found'));
    }

    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);
      return next(new BadRequestError(errors[0].message));
    }
    next();
  }
};

export const removeShortLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const ownerId = res.locals.user.id;

  try {
    //проверяем пользователя
    const currentShortLink = await Shortner.findById(id).orFail();

    if (!currentShortLink.checkOwner(ownerId)) {
      return next(new ForbiddenError('You have no access to this resource'));
    }

    //
    await Shortner.findByIdAndDelete(id);

    res.send({ id });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Invalid ID'));
    }

    if (error instanceof MongooseError.DocumentNotFoundError) {
      return next(new NotFoundError('Short link not found'));
    }

    next(error);
  }
};
