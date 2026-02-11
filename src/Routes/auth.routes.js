import { Router } from "express";
import { logIn, logOut, signUp, tokenRefresh } from "../Controllers/auth.controller.js";
import { validate } from "../Middlewares/validator.middleware.js";
import { userSchema } from "../Middlewares/validators.js";

const router = Router();

router.route("/sign-up").post(validate(userSchema), signUp);
router.route("/log-in").post(validate(userSchema), logIn);
router.route("/log-out").delete(logOut);
router.route("/refresh-token").get(tokenRefresh);

export default router;