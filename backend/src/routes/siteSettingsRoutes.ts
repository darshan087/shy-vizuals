import { Router } from "express";

import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController";

import { ownerAuth } from "../middleware/authMiddleware";

const router = Router();

// Customer/public
router.get("/", getSiteSettings);

// Owner
router.patch("/", ownerAuth, updateSiteSettings);

export default router;
