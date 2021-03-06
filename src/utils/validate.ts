import Joi from 'joi';

import { HttpError } from './error';

export function validateInput(input: object, schema: Joi.ObjectSchema) {
  const { error, value } = schema.validate(input);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }

  return value;
}
