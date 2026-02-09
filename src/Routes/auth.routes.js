import { Router } from "express";
import { logIn, logOut, signUp, tokenRefresh } from "../Controllers/auth.controller.js";

const router = Router();

router.route("/sign-up").post(signUp);
router.route("/log-in").post(logIn);
router.route("/log-out").delete(logOut);
router.route("/refresh-token").get(tokenRefresh);

export default router;