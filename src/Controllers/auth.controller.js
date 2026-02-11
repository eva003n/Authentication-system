import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Never send user friendly messages when  performing authentication, use generic information
 * Prevent aganist timing attacks -> algorithms for contant time comparison hashes, simullate response time delay
 */
const signUp = asyncHandler(async (req, res, next) => {
  // sanitized data
  const { email, password } = req.body;

  // check if user with similar email exists
  const user = await User.findOne({
    email,
  });

  if (user)
    return next(
      ApiError.conflictRequest(409, req.originalUrl, "Authentication failed"),
    );

  // create user credentials
  const newUser = await User.create({
    email,
    password,
  });

  // hide password from response
  newUser.password = undefined;

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "Account created successfully"));
});

const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  //prevent timing attacks
  setTimeout(() => {
    if (!user)
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          "Authentication failed",
        ),
      );
  }, 1000);

  const isValidPassword = await user.isMatchingPassword(password);
  //prevent timing attacks
  if (!isValidPassword)
    setTimeout(() => {
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          "Authentication failed",
        ),
      );
    }, 1000);

  // hide password from response
  user.password = undefined;

  res.status(200).json(new ApiResponse(200, user, "Logged in successfully"));
});

const logOut = asyncHandler(async (req, res, next) => {});

const tokenRefresh = asyncHandler(async (req, res, next) => {});

export { signUp, logIn, logOut, tokenRefresh };
