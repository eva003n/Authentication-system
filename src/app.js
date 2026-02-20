import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import { redisStore } from "./config/db/redis/index.js";
import { SESSION_SECRET, NODE_ENV, COOKIE_SECRET } from "./config/env.js";

// Import middleware and routes
import morganMiddleware from "./logger/morgan.js";
import { CORS_ORIGIN_URLS } from "./config/env.js";
import homeRouter from "./Routes/home.routes.js"
import authRouter from "./Routes/auth.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import authUIRouter from "./Routes/authUI.routes.js";
import notFoundRouter from "./Routes/404.routes.js";
import errorHandlerMiddleware from "./Middlewares/errorHandler.middleware.js";

const app = express();

// Set up file path utilities
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

// Tell express to use ejs as the template engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirName, "./views"));


app.use(
  cors({
    origin: CORS_ORIGIN_URLS.split(" "),
    credentials: true,
  }),
);
// Security middleware
app.use(helmet());

/* --- Cookie and CORS parsing --- */

// this will return a signed cookie with the HMAC algorithm(value of each key is signed) to prevent tampering
app.use(cookieParser(COOKIE_SECRET.split(",")))

// Request logging middleware
app.use(morganMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.resolve(__dirName, "../public")));

// handle sessions
app.use(
  session({
    cookie: {
      path: "/",
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 60000, // i second
      sameSite: "strict",
    },
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: redisStore,
  }),
);

/*  API endpoints  */
app.use("/", homeRouter)
app.use("/api/v1/auth", authRouter);

/* User interface for the auth system */
app.use("/admin", adminRouter);
app.use("/auth", authUIRouter);

// 404 and error handling - should be last
app.use(notFoundRouter);
app.use(errorHandlerMiddleware);

export { app };
