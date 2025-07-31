import { Router } from "express";
import * as controller from "../controllers/careerProfile.controller.ts";
import { userContext } from "../middlewares/userContext.middleware.ts";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/:id/download", controller.getSignedUrlById);
router.post("/", userContext, controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
