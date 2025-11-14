import { NextFunction, Request, Response } from 'express';
import { getShortUrl } from './shortner.service';

export const createShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.body.url;

  try {
    const shortLink = await getShortUrl(url);

    res.status(201).send({
      originalLink: url,
      shortLink,
    });
  } catch (error) {
    next(error);
  }
};
