import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env.js";
import { redisClient } from "../config/db/redis/index.js";

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
      ApiError.conflictRequest(401, req.originalUrl, "Authentication failed"),
    );

  // create user credentials
  const newUser = await User.create({
    userName: email?.split("@")[0],
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

  // if its an admin create session otherwise use jwt token
  if (user.role === "admin") {
    req.session.userId = user._id;
  }

  // generate tokens
  const { accessToken, refreshToken } = await generateToken({
    id: user._id,
    role: user.role,
  });

  /** For enhanced security
 * Refresh token may be kept on some persistent store, which will make it a n opaque token

*/
  await redisClient.set("refresh", refreshToken);


  // send jwt token

  res
    .status(200)
    .cookie(
      "AccessToken",
      accessToken,
      {
        path: "/",
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 15 * 60 * 1000,
      },
      { signed: true },
    )
   /*  .cookie(
      "RefreshToken",
      refreshToken,
      {
        path: "/",
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 24 * 60 * 60 * 1000, // seconds in i day(When dealing with express this should be in ms while setting raw header it is in secs)
      },
      { signed: true },
    ) */

    .json(new ApiResponse(200, user, "Logged in successfully"));
});

const logOut = asyncHandler(async (req, res, next) => {
  // if admin also detroy session
  if (req.user.role === "admin") {
    req.session.destroy();
  }

  // delete cookie for normal users and admins
  res
    .clearCookie("AccessToken")
    // .clearCookie("RefreshToken")
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const tokenRefresh = asyncHandler(async (req, res, next) => {
  //make sure cookie is not tampered with
  if (!req.signedCookies) {
    return next(ApiError.badRequest(400, req.originalUrl, "Bad request"));
  }

  const oldRefreshToken = req.signedCookies.RefreshToken;
  // check cookie for old refresh token
  if (!refreshToken) {
    return next(ApiError.badRequest(400, req.originalUrl, "Bad request"));
  }

  // verify token
  const decodedRefreshToken = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);

  // check token exist in store(redis)
  const exists = await redisClient.get("refresh");
  if (!exists) {
    return next(
      ApiError.forbiddenRequest(403, req.originalUrl, "Fordidden"),
    );
  }

  // rotate
  // delete from redis(invalidate the refresh token)
  await redisClient.del("refresh");

  // generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = await generateToken({
    id: decodedRefreshToken.id,
    role: decodedRefreshToken.role,
  });
  // save in redis
  await redisClient.set("refresh", newRefreshToken);

  // send jwt token

  res
    .status(200)
    .cookie(
      "AccessToken",
      accessToken,
      {
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 15 * 60 * 1000,
      },
      { signed: true },
    )
    /*  .cookie(
      "RefreshToken",
      refreshToken,
      {
        httpOnly: true, // prevent XSS
        secure: NODE_ENV === "production", // encrypt cookie
        sameSite: "strict", // prevent CRSF
        maxAge: 24 * 60 * 60 * 1000, // seconds in i day(When dealing with express this should be in ms while setting raw header it is in secs)
      },
      { signed: true },
    ) */

    .json(new ApiResponse(200, user, "Token generated successfully"));
});

const basicAuthHandler = asyncHandler(async (req, res, next) => {
  res.send("<h1>Basic auth schema protected resource </h1>");
});

const generateToken = async (user) => {
  // access token
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
    issuer: "authapi",
    expiresIn: "15min",
    subject: "authentication",
  });

  // refresh token
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    issuer: "authapi",
    expiresIn: "1day",
    subject: "authentication",
  });

  return {
    accessToken,
    refreshToken,
  };
};

/*  Auth UI handlers */
const signUpPage = async (req, res) => {
  const authData = {
    signUP: true,
  };
  // renders sign up page
  res.render("auth", authData);
};

const signInPage = async (req, res) => {
  // renders sign in page
  const authData = {
    signUP: false,
  };
  // renders sign up page
  res.render("auth", authData);
};

export {
  signUp,
  logIn,
  logOut,
  tokenRefresh,
  basicAuthHandler,
  signUpPage,
  signInPage,
};
