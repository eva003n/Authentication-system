//HTTP APi Problem details RFC spec
/*
 * https://datatracker.ietf.org/doc/html/rfc7807
 * https://www.rfc-editor.org/rfc/rfc9457.html
 
 */

//standadize error response
class ApiError extends Error {
  constructor(
    type,
    title,
    statusCode = 500,
    errors = null,
    message = "Something went wrong",
    instance,
  ) {
    // pevent generating stack trace twice(Optimization)
    const { stackTraceLimit } = Error; // 10

    Error.stackTraceLimit = 0;
    super(message); // no stack trace generated
    Error.stackTraceLimit = stackTraceLimit;

    this.type = type ? `/${type}` : "about:blank";
    this.title = title;
    this.status = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.instance = instance;

    if (!this.stack) {
      //captures the stack trace manually from when this object is created and sets it to the stack property for instance of ApiError
      Error.captureStackTrace(this, this.constructor);
    }
  }
  // static method to create a new instance of ApiError

  static badRequest(
    statusCode,
    instance,
    message = "Bad Request",
    errors = null,
    type = "probs/validation-error",
    title = "Validationerrors",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }

  static unAuthorizedRequest(
    statusCode,
    instance,
    message = "Unauthorized request",
    errors = null,
    type = "probs/unauthorized-error",
    title = "Unauthorized request",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static conflictRequest(
    statusCode,
    instance,
    message = "Conflict request",
    errors = null,
    type = "probs/conflict-error",
    title = "Conflict request",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static notFound(
    statusCode,
    instance,
    message = "Not Found",
    errors = null,
    type = "probs/not-found-error",
    title = "ResourceNotFoundError",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }

  static unprocessable(
    statusCode,
    instance,
    message = "Unprocessable content",
    errors = null,
    type = "probs/unprocessable-error",
    title = "UnprocessableError",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static tooManyRequest(
    statusCode,
    instance,
    message = "Too many requests",
    errors = null,
    type = "probs/too-many-request-error",
    title = "TooManyRequestError",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static forbiddenRequest(
    statusCode,
    instance,
    message = "Forbidden request",
    errors = null,
    type = "probs/forbidden-error",
    title = "ForbiddenError",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static internalServerError(
    statusCode = 500,
    instance,
    message = "Something went wrong",
    errors = null,
    type = "probs/internal-error",
    title = "InternalError",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }

  static serviceUnavavilable(
    statusCode = 503,
    instance,
    message = "Service unavailable, try again later",
    errors = null,
    type = "probs/unavailable-error",
    title = "UnaavailableError",
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
}

export default ApiError;
