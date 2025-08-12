
import { Router } from "express";
import * as controller from "../controllers/interviewQuestion.controller.ts";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.delete("/:id", controller.remove);

export default router;
