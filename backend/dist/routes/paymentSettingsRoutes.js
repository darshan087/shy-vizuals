"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentSettingsController_1 = require("../controllers/paymentSettingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public - customer needs this when booking
router.get("/", paymentSettingsController_1.getPaymentSettings);
// Owner only
router.patch("/", authMiddleware_1.ownerAuth, paymentSettingsController_1.updatePaymentSettings);
exports.default = router;
