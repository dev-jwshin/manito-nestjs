export default () => ({
  appName: process.env.APP_NAME || 'NestJS 애플리케이션',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    name: process.env.DATABASE_NAME || 'nestjs_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
});
