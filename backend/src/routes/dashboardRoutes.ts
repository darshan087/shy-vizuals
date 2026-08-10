import { Router } from "express";

import {
  getOwnerDashboard,
} from "../controllers/dashboardController";

import {
  ownerAuth,
} from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  ownerAuth,
  getOwnerDashboard
);

export default router;