import { createClient } from "redis";
import { REDIS_URL } from "../../env.js";
import logger from "../../../logger/logger.winston.js"


const redisClient = await createClient();

redisClient.on("error", (err) => logger.error(`Redis error: ${err.message}`))
redisClient.connect();

if(redisClient.isReady) {
    logger.info("Redis connected successfully")
}


export {
    redisClient
}