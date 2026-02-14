import logger from "../logger/logger.winston.js";
import ApiError from "../utils/ApiError.js";


const errorHandlerMiddleware = async (
  err,
  req,
  res,
  next,
) => {
  if (err instanceof ApiError) {
    logger.error(`Api Error : ${err.message}`);

    return res.type("application/problem+json").status(err.status).json(err);
  }
  
  else if(err instanceof TokenExpiredError) {
    logger.error(`JWT expired Error: ${err.message}: expired at ${err.expiredAt}`)
    return res
      .type("application/problem+json")
      .status(400)
      .json(ApiError.badRequest(400, req.originalUrl, "Bad request"));

  }

  else if(err instanceof JsonWebTokenError) {
    logger.error(`JWT error: ${err.message}`)
     return res
      .type("application/problem+json")
      .status(400)
      .json(ApiError.badRequest(400, req.originalUrl, "Bad request"));
  
  }

  else {
    logger.error(`Server Error : ${err.message}`)
  
    return res
      .type("application/problem+json")
      .status(500)
      .json(ApiError.internalServerError(500, req.originalUrl, "Server error, something went wrong"));
  }
};
export default errorHandlerMiddleware;
