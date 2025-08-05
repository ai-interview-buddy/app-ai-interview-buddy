import { Router } from "express";
import * as controller from "../controllers/timeline.controller.ts";
import { userContext } from "../middlewares/userContext.middleware.ts";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/note", userContext, controller.createNote);
router.post("/cover-letter", userContext, controller.createCoverLetter);
router.post("/linkedin-intro", userContext, controller.createLinkedinIntro);
router.post("/reply-email", userContext, controller.createReplyEmail);
router.patch("/:id/custom-instructions", controller.updateCustomInstructions);
router.delete("/:id", controller.remove);

export default router;
