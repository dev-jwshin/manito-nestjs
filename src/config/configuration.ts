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
  test1: process.env.TEST1 || '기본값',
  test2: process.env.TEST2 || '기본값',
});
