import { Router } from "express";
import { signInPage, signUpPage } from "../Controllers/auth.controller.js";

const router = Router();

/* This routes handle rendering the UI for the auth system */
router.route("/sign-up").get(signUpPage)
router.route("/sign-in").get(signInPage)

export default router;