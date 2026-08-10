"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/*
 * CUSTOMER
 */
// Create booking
router.post("/", bookingController_1.createBooking);
/*
 * OWNER
 */
// Get all bookings
router.get("/", authMiddleware_1.ownerAuth, bookingController_1.getBookings);
// Get one booking
router.get("/:id", authMiddleware_1.ownerAuth, bookingController_1.getBookingById);
// Update booking
router.patch("/:id", authMiddleware_1.ownerAuth, bookingController_1.updateBooking);
/*
 * CUSTOMER PAYMENT
 */
// Attach payment screenshot to booking
router.patch("/:id/payment-screenshot", bookingController_1.attachPaymentScreenshot);
exports.default = router;
