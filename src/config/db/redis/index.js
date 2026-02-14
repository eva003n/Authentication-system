import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import { REDIS_URL } from "../../env.js";
import logger from "../../../logger/logger.winston.js";

// create a connection to redis
const redisClient = await createClient();

// adapter layer to communicate btw espress session and redis
const redisStore = new RedisStore({
  client: redisClient,
});

async function connectRedis() {
    redisClient.on("connect", () => logger.info("Connecting to redis"));
    redisClient.on("ready", () =>
      logger.info("Successfully connected to redis"),
    );
    redisClient.on("end", () => logger.warn("Redis disconnected"));
    redisClient.on("error", (err) =>
      logger.error(`Error connecting redis: ${err.message}`),
    );

    // creates tcp connection to redis
    await redisClient.connect();

    // ping redis
    await redisClient.ping();
}


export { redisStore, redisClient, connectRedis };
