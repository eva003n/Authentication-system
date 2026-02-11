import morgan from "morgan";
import logger from "./logger.winston.js";

const format = ":method :url :status :response-time ms";
const morganMiddleware = morgan(format, {
  stream: {
    write: (message) => {
      const parts = message.trim().split(" ");
      const logObject = {
        method: parts[0],
        url: parts[1],
        status: parts[2],
        responseTime: `${parts[3]}ms`,
      };
      logger.info(JSON.stringify(logObject));
    },
  },
});
export default morganMiddleware;
