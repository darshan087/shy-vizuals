"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siteSettingsController_1 = require("../controllers/siteSettingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Customer/public
router.get("/", siteSettingsController_1.getSiteSettings);
// Owner
router.patch("/", authMiddleware_1.ownerAuth, siteSettingsController_1.updateSiteSettings);
exports.default = router;
