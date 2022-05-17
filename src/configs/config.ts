import { DotenvConfigOutput, config } from 'dotenv';

const envFound: DotenvConfigOutput = config();

if (!envFound) {
  throw new Error('.env file was not found.');
}
const host = process.env.HOST;
const port = process.env.PORT;
const jwtAccessKey = process.env.JWT_KEY_ACCESS;
const jwtRefreshKey = process.env.JWT_KEY_REFRESH;
const expiresIn = process.env.EXPIRESIN;
const emailHelper = process.env.EMAIL;
const passwordEmail = process.env.PASSWORD;

const APIResponse = class {
  success: boolean;
  data: object;
  constructor(success = true, data = {}) {
    this.success = success;
    this.data = data;
  }
};

export const configs = {
  pagination: {
    page: 1,
    recordsAPage: 20,
  },
  host,
  port,
  jwtAccessKey,
  jwtRefreshKey,
  expiresIn,
  emailHelper,
  passwordEmail,
  APIResponse,
  db: {
    type: String(process.env.DB_TYPE),
    synchronize: true,
    logging: false,
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    username: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_NAME),
    autoLoadEntities: true,
    entities: ['dist/**/**/*.entity{.ts,.js}'],
  },
};
