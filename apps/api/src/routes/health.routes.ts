import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";
import { asyncHandler } from "../middleware/async-handler";

const router: Router = Router();

router.get("/health", asyncHandler(healthCheck));

export { router as healthRouter };
