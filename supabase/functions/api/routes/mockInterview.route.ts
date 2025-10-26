import { Router } from "express";
import * as controller from "../controllers/mockInterview.controller.ts";
import { userContext } from "../middlewares/userContext.middleware.ts";

const router = Router();

router.post("/", userContext, controller.create);

export default router;
