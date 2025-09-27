import { Router } from "express";
import * as controller from "../controllers/account.controller.ts";
import { userContext } from "../middlewares/userContext.middleware.ts";

const router = Router();

router.delete("/", userContext, controller.remove);

export default router;
