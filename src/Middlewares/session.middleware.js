import session from "express-session";
import {NODE_ENV, SESSION_SECRET} from "../config/env.js"
import { redisClient } from "../config/db/redis/index.js";



const sessionAuth = async (req, res) =>
  session({
    cookie: {
      path: req.originalUrl,
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 60000, // i second
      sameSite: "strict"
    },
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: redisClient

  });

  export {
    sessionAuth
  }