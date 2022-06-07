import { DotenvConfigOutput, config } from 'dotenv';

const envFound: DotenvConfigOutput = config();

if (!envFound) {
  throw new Error('.env file was not found.');
}
const dbDev = {
  type: String(process.env.DB_DEV_TYPE),
  synchronize: true,
  logging: 'all',
  host: String(process.env.DB_DEV_HOST),
  port: Number(process.env.DB_DEV_PORT),
  username: String(process.env.DB_DEV_USER),
  password: String(process.env.DB_DEV_PASSWORD),
  database: String(process.env.DB_DEV_NAME),
  autoLoadEntities: true,
  entities: ['dist/**/**/*.entity{.ts,.js}'],
};

const dbtest = {
  type: String(process.env.DB_TEST_TYPE),
  synchronize: true,
  logging: false,
  host: String(process.env.DB_TEST_HOST),
  port: Number(process.env.DB_TEST_PORT),
  username: String(process.env.DB_TEST_USER),
  password: String(process.env.DB_TEST_PASSWORD),
  database: String(process.env.DB_TEST_NAME),
  autoLoadEntities: true,
  entities: ['dist/**/**/*.entity{.ts,.js}'],
};

const db = process.env.NODE_ENV === 'test' ? dbtest : dbDev;

export const configs = {
  pagination: {
    page: 1,
    recordsAPage: 20,
  },
  host: process.env.HOST,
  port: process.env.PORT,
  jwtAccessKey: process.env.JWT_KEY_ACCESS,
  jwtRefreshKey: process.env.JWT_KEY_REFRESH,
  expiresIn: process.env.EXPIRESIN,
  emailHelper: process.env.EMAIL,
  emailPassword: process.env.PASSWORD_EMAIL,
  db,
};
