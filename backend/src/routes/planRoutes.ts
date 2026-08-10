import { Router } from "express";

import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController";

import { ownerAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getPlans);
router.get("/:id", getPlanById);

router.post("/", ownerAuth, createPlan);
router.patch("/:id", ownerAuth, updatePlan);
router.delete("/:id", ownerAuth, deletePlan);

export default router;