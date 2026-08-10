import { Router } from "express";

import {
  getPaymentSettings,
  updatePaymentSettings,
} from "../controllers/paymentSettingsController";

import { ownerAuth } from "../middleware/authMiddleware";

const router = Router();

// Public - customer needs this when booking
router.get("/", getPaymentSettings);

// Owner only
router.patch("/", ownerAuth, updatePaymentSettings);

export default router;