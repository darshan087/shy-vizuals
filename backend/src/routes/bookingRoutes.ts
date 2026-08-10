import { Router } from "express";

import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  attachPaymentScreenshot,
} from "../controllers/bookingController";

import { ownerAuth } from "../middleware/authMiddleware";

const router = Router();

/*
 * CUSTOMER
 */

// Create booking
router.post("/", createBooking);

/*
 * OWNER
 */

// Get all bookings
router.get("/", ownerAuth, getBookings);

// Get one booking
router.get("/:id", ownerAuth, getBookingById);

// Update booking
router.patch("/:id", ownerAuth, updateBooking);

/*
 * CUSTOMER PAYMENT
 */

// Attach payment screenshot to booking
router.patch(
  "/:id/payment-screenshot",
  attachPaymentScreenshot
);

export default router;