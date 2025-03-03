import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'local'),
  PORT: Joi.number(),
  APP_NAME: Joi.string(),
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.number(),
  DATABASE_USERNAME: Joi.string(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  SESSION_MAX_AGE: Joi.number(),
  REDIS_HOST: Joi.string(),
  REDIS_PORT: Joi.number(),
  REDIS_PASSWORD: Joi.string().allow(''),
});
