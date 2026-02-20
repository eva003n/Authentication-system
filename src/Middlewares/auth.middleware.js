import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Buffer } from "buffer";
import { authSchema, jwtSchema, userSchema } from "./validators.js";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import logger from "../logger/logger.winston.js";

const basicAuth = asyncHandler(async (req, res, next) => {
  // first check the authorization header for credentials
  const credentials = req.headers.authorization; // base64 encoded string

  // no credentials provided
  if (!credentials) {
    res.setHeader("Www-authenticate", `Basic realm=${req.originalUrl}`);
    return res.status(401).send();
  }
  // header value -> "basic 'usernameandpassword'"
  const base64String = credentials.split(" ")[1];

  // then decode the base64 string first we create a buffer from the string
  const buffer = Buffer.from(base64String, "base64");
  // convert the string from base64 to utf-8
  const [username, password] = buffer.toString("utf-8").split(":"); // "username:password"
  // vali=date and sanitize
  const { error } = authSchema.safeParse({ username, password });
  if (error) {
    console.log(error);
    res.setHeader("Www-Authenticate", `Basic realm=${req.originalUrl}`);
    return res.status(401).send();
  }

  const user = await User.findOne({ userName: username }).select("+password"); // select here tells mongoose to include password which is hidden by default
  if (!user) {
    // challenge the browser to reprompt for credentials
    res.setHeader("Www-Authenticate", `Basic realm=${req.originalUrl}`);
    return res.status(401).send();
  }

  if (!(await user.isMatchingPassword(password))) {
    res.setHeader("Www-Authenticate", `Basic realm=${req.originalUrl}`);
    return res.status(401).send();
  }

  // hide password after done with check
  user.password = undefined;

  // credentials are valid, access resource
  next();
});

const protectRoute = asyncHandler(async (req, res, next) => {

  // get access token from cookie header
  const accessToken = req.signedCookies.AccessToken;
  // no token in cookie
  if (!accessToken) {
    return next(ApiError.badRequest(400, req.originalUrl));
  }

  // verify jwt token.
  const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

  // sanitize the decoded token to make sure we work with expected propeties
  const { error } = jwtSchema.safeParse(decodedToken);
  if (error) {
    // console.log("invalid token");

    return next(ApiError.badRequest(400, req.originalUrl));
  }

  const user = {
    id: decodedToken.id,
    role: decodedToken.role,
  };

  // attach the user to request
  req.user = user;

  // move to next function
  next();
});

// middleware to protect admin routes
const privateRoute = asyncHandler(async (req, res, next) => {
  // only allow admins
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json(ApiError.forbiddenRequest(403, req.originalUrl, "Access denied"));
  }

  // check if admin exist in session store, if not redirect to login
  if (!req.session || !req.session.userId) {
     return res
       .status(403)
       .json(ApiError.forbiddenRequest(403, req.originalUrl, "Access denied"));
  }

  // now the admin can access resource
  next();
});
export { basicAuth, protectRoute, privateRoute };
