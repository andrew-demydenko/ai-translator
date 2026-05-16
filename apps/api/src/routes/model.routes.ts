import { Router } from "express";
import { listModels } from "../controllers/model.controller";
import { asyncHandler } from "../middleware/async-handler";

const router: Router = Router();

router.get("/models", asyncHandler(listModels));

export { router as modelRouter };
