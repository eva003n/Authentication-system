import {Router} from "express"
import { protectRoute, privateRoute } from "../Middlewares/auth.middleware.js";
import {getAdminControlPage} from "../Controllers/admin.controller.js"

const router = Router();

/*  Outer protection for all users | admins using the api via JWT*/
router.use(protectRoute)

/* Outer protection for all admins using the api via sessions for enhanced security */
router.use(privateRoute)
router.route("/").get(getAdminControlPage)

export default router;