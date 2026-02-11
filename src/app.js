import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import middleware and routes
import morganMiddleware from "./logger/morgan.js";
import { CORS_ORIGIN_URLS } from "./config/env.js";
import authRouter from "./Routes/auth.routes.js";
import notFoundRouter from "./Routes/404.routes.js";
import errorHandlerMiddleware from "./Middlewares/errorHandler.middleware.js";

const app = express();

// Set up file path utilities
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

// Tell express to use ejs as the template engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirName, "./views"));

// Request logging middleware
app.use(morganMiddleware);

// Security middleware
app.use(helmet());

// Cookie and CORS parsing
app.use(cookieParser());
app.use(
  cors({
    origin: CORS_ORIGIN_URLS.split(" "),
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => res.send("Home page"));
app.use("/api/v1/auth", authRouter);

// 404 and error handling - should be last
app.use(notFoundRouter);
app.use(errorHandlerMiddleware);

export { app };
