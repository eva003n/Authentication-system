import { config } from "dotenv";

// load .env variables current working directory
config({
  path: `src/.env`,
});

export const { PORT } = process.env;
