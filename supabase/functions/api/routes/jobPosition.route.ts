import { Router } from "express";
import * as controller from "../controllers/jobPosition.controller.ts";
import { userContext } from "../middlewares/userContext.middleware.ts";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/by-url", userContext, controller.createByUrl);
router.post("/by-description", userContext, controller.createByDescription);
router.patch("/archive", controller.archiveMany);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
