import { Router } from "express";

import {
  createMedia,
  getMedia,
  getAllMediaForOwner,
  updateMedia,
  toggleMedia,
  deleteMedia,
} from "../controllers/mediaController";

import { ownerAuth } from "../middleware/authMiddleware";

import { mediaUpload } from "../middleware/upload";

const router = Router();

// Customer/public
router.get("/", getMedia);

// Owner
router.get(
  "/owner",
  ownerAuth,
  getAllMediaForOwner
);

router.post(
  "/owner",
  ownerAuth,
  mediaUpload.single("media"),
  createMedia
);

router.patch(
  "/owner/:id",
  ownerAuth,
  updateMedia
);

router.patch(
  "/owner/:id/toggle",
  ownerAuth,
  toggleMedia
);

router.delete(
  "/owner/:id",
  ownerAuth,
  deleteMedia
);

export default router;