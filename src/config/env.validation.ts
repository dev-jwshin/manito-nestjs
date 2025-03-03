import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'local')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('NestJS 애플리케이션'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  TEST1: Joi.string(),
  TEST2: Joi.string(),
});
