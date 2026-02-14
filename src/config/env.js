import { config } from "dotenv";

// load .env variables current working directory
config({
  path: `src/.env`,
});

export const {
  PORT,
  NODE_ENV,
  DB_NAME,
  MONGO_URL,
  CORS_ORIGIN_URLS,
  SESSION_SECRET,
  REDIS_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  COOKIE_SECRET,
} = process.env;
