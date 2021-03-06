import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import axios from 'axios';

import { HttpError } from './utils/error';
import { validateInput } from './utils/validate';

const prisma = new PrismaClient();

export async function subscribeToTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const topic = req.params.topic.toLowerCase();
    const { url } = validateInput(
      req.body,
      Joi.object().keys({
        url: Joi.string().uri().required().lowercase().messages({
          'any.required': 'Url is required',
          'string.empty': 'Url is required',
          'string.uri': 'Url is not valid'
        })
      })
    );

    const subscription = {
      url,
      topic
    };
    await prisma.subscription.create({ data: subscription }).catch((err) => {
      if (err.code === 'P2002') {
        throw new HttpError(400, 'Already subscribed!');
      }
      throw err;
    });

    res.json(subscription);
  } catch (error) {
    next(error);
  }
}

export async function publishToTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const topic = req.params.topic.toLowerCase();
    const data = req.body;

    if (data === undefined) {
      throw new HttpError(400, 'Data to publish is required');
    }

    const subscribers = await prisma.subscription.findMany({
      where: { topic }
    });

    const promises = subscribers.map((x) => axios.post(x.url, { topic, data }));
    await Promise.all(promises).catch((err) => {
      throw new HttpError(503, `Failed to push to subscriber: ${err.config.url}`);
    });

    res.json({ message: 'Notification published successfully' });
  } catch (error) {
    next(error);
  }
}
