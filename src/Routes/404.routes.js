import { Router } from "express";
import notFound from "../controllers/notfound.controller.js";

const router = Router();

router.all("/{*splat}", notFound);
export default router;
