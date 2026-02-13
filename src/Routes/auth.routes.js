import { Router } from "express";
import { basicAuthHandler, logIn, logOut, signUp, tokenRefresh } from "../Controllers/auth.controller.js";
import { validate } from "../Middlewares/validator.middleware.js";
import { userSchema } from "../Middlewares/validators.js";
import { basicAuth } from "../Middlewares/basicauth.middleware.js";
import { sessionAuth } from "../Middlewares/session.middleware.js";

const router = Router();

router.route("/sign-up").post(validate(userSchema), signUp);
router.route("/sign-in").post(validate(userSchema), logIn);
router.route("/sign-out").delete(logOut);
router.route("/refresh-token").get(tokenRefresh);
router.route("/basic-auth").get(basicAuth, basicAuthHandler)
router.route("/session-auth").get(sessionAuth)


export default router;