import ApiError from "../utils/ApiError.js";


const errorHandlerMiddleware = async (
  err,
  req,
  res,
  next,
) => {
  if (err instanceof ApiError) {
    console.dir(err);
  

    return res.type("application/problem+json").status(err.status).json(err);
  } 

  else {
    console.error(err.message)
    console.dir(err)
    return res
      .type("application/problem+json")
      .status(500)
      .json(ApiError.internalServerError(500, req.originalUrl, "Server error, something went wrong"));
  }
};
export default errorHandlerMiddleware;
