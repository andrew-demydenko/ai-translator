import { Router } from "express";
import { setApiKey, getStatus } from "../controllers/config.controller";
import { asyncHandler } from "../middleware/async-handler";

const router: Router = Router();

router.post("/config/api-key", asyncHandler(setApiKey));
router.get("/config/status", asyncHandler(getStatus));

export { router as configRouter };
