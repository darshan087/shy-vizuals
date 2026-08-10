import { Router } from "express";

import {
  createPlan,
  updatePlan,
  togglePlan,
  deletePlan,
} from "../controllers/ownerPlanController";

import { ownerAuth } from "../middleware/authMiddleware";

const router = Router();

// All routes are owner-only
router.post("/", ownerAuth, createPlan);

router.patch("/:id", ownerAuth, updatePlan);

router.patch(
  "/:id/toggle",
  ownerAuth,
  togglePlan
);

router.delete(
  "/:id",
  ownerAuth,
  deletePlan
);

export default router;
