import { Router } from "express";
import { basicAuthHandler, logIn, logOut, signUp, tokenRefresh } from "../Controllers/auth.controller.js";
import { validate } from "../Middlewares/validator.middleware.js";
import { userSchema } from "../Middlewares/validators.js";
import { basicAuth, protectRoute } from "../Middlewares/auth.middleware.js";

const router = Router();

/*  API endpoints that will process the authentication system request */
router.route("/sign-up").post(validate(userSchema), signUp);
router.route("/sign-in").post(validate(userSchema), logIn);
router.route("/refresh-token").get(tokenRefresh);


/*  Outer protection for all user using the api via JWT*/
router.use(protectRoute)
router.route("/sign-out").delete(logOut);
router.route("/basic-auth").get(basicAuth, basicAuthHandler)


export default router;