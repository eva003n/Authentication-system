import { Router } from "express";
import { homePage } from "../Controllers/home.controller.js";
import { protectRoute } from "../Middlewares/auth.middleware.js";

const router = Router();


router.route("/").get(protectRoute, homePage);

export default router