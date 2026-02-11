import { config } from "dotenv";

// load .env variables current working directory
config({
  path: `src/.env`,
});

export const { PORT, DB_NAME, MONGO_URL, CORS_ORIGIN_URLS } = process.env;
