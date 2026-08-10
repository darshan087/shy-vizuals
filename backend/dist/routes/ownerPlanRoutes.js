"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ownerPlanController_1 = require("../controllers/ownerPlanController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All routes are owner-only
router.post("/", authMiddleware_1.ownerAuth, ownerPlanController_1.createPlan);
router.patch("/:id", authMiddleware_1.ownerAuth, ownerPlanController_1.updatePlan);
router.patch("/:id/toggle", authMiddleware_1.ownerAuth, ownerPlanController_1.togglePlan);
router.delete("/:id", authMiddleware_1.ownerAuth, ownerPlanController_1.deletePlan);
exports.default = router;
