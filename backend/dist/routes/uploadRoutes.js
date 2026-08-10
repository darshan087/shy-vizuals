"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const upload_1 = require("../middleware/upload");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/*
 * CUSTOMER PAYMENT SCREENSHOT
 */
router.post("/payment-screenshot", upload_1.paymentScreenshotUpload.single("screenshot"), uploadController_1.uploadPaymentScreenshot);
/*
 * OWNER PLAN IMAGE
 */
router.post("/plan-image", authMiddleware_1.ownerAuth, upload_1.planImageUpload.single("image"), uploadController_1.uploadPlanImage);
/*
 * OWNER LOGO
 */
router.post("/logo", authMiddleware_1.ownerAuth, upload_1.logoUpload.single("logo"), uploadController_1.uploadLogo);
/*
 * OWNER PAYMENT QR
 */
router.post("/payment-qr", authMiddleware_1.ownerAuth, upload_1.paymentQrUpload.single("qr"), uploadController_1.uploadPaymentQr);
exports.default = router;
