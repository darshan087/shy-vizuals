import { Router } from "express";

import {
  uploadPaymentScreenshot,
  uploadPlanImage,
  uploadLogo,
  uploadPaymentQr,
} from "../controllers/uploadController";

import {
  paymentScreenshotUpload,
  planImageUpload,
  logoUpload,
  paymentQrUpload,
} from "../middleware/upload";

import { ownerAuth } from "../middleware/authMiddleware";

const router = Router();

/*
 * CUSTOMER PAYMENT SCREENSHOT
 */
router.post(
  "/payment-screenshot",
  paymentScreenshotUpload.single("screenshot"),
  uploadPaymentScreenshot
);

/*
 * OWNER PLAN IMAGE
 */
router.post(
  "/plan-image",
  ownerAuth,
  planImageUpload.single("image"),
  uploadPlanImage
);

/*
 * OWNER LOGO
 */
router.post(
  "/logo",
  ownerAuth,
  logoUpload.single("logo"),
  uploadLogo
);

/*
 * OWNER PAYMENT QR
 */
router.post(
  "/payment-qr",
  ownerAuth,
  paymentQrUpload.single("qr"),
  uploadPaymentQr
);

export default router;