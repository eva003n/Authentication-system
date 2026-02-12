import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Buffer } from "buffer";
import { authSchema, userSchema } from "./validators.js";

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

  if (!user.isMatchingPassword(password)) {
    res.setHeader("Www-Authenticate", `Basic realm=${req.originalUrl}`);
    return res.status(401).send();
  }

  // hide password after done with check
  user.password = undefined;

  // credentials are valid, access resource
  next();
});

export { basicAuth };
