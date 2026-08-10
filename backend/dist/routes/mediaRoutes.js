"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mediaController_1 = require("../controllers/mediaController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// Customer/public
router.get("/", mediaController_1.getMedia);
// Owner
router.get("/owner", authMiddleware_1.ownerAuth, mediaController_1.getAllMediaForOwner);
router.post("/owner", authMiddleware_1.ownerAuth, upload_1.mediaUpload.single("media"), mediaController_1.createMedia);
router.patch("/owner/:id", authMiddleware_1.ownerAuth, mediaController_1.updateMedia);
router.patch("/owner/:id/toggle", authMiddleware_1.ownerAuth, mediaController_1.toggleMedia);
router.delete("/owner/:id", authMiddleware_1.ownerAuth, mediaController_1.deleteMedia);
exports.default = router;
