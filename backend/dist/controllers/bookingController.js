"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPaymentScreenshot = exports.updateBooking = exports.getBookingById = exports.getBookings = exports.createBooking = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bookingNumber_1 = require("../utils/bookingNumber");
const createBooking = async (req, res) => {
    try {
        const { customerName, phone, email, location, bookingDate, bookingTime, planId, requirements, paymentScreenshot, } = req.body;
        if (!customerName ||
            !phone ||
            !email ||
            !location ||
            !bookingDate ||
            !planId) {
            res.status(400).json({
                success: false,
                message: "Customer name, phone, email, location, booking date and plan are required",
            });
            return;
        }
        const numericPlanId = Number(planId);
        if (!Number.isInteger(numericPlanId)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
            return;
        }
        const plan = await prisma_1.default.plan.findFirst({
            where: {
                id: numericPlanId,
                isActive: true,
            },
        });
        if (!plan) {
            res.status(404).json({
                success: false,
                message: "Selected plan not found or inactive",
            });
            return;
        }
        const parsedDate = new Date(bookingDate);
        if (Number.isNaN(parsedDate.getTime())) {
            res.status(400).json({
                success: false,
                message: "Invalid booking date",
            });
            return;
        }
        const paymentSettings = await prisma_1.default.paymentSettings.findFirst();
        let advanceAmount = Number(plan.price) * 0.3;
        if (paymentSettings) {
            if (paymentSettings.advanceType === "FIXED") {
                advanceAmount = Number(paymentSettings.advanceValue);
            }
            else {
                advanceAmount =
                    (Number(plan.price) *
                        Number(paymentSettings.advanceValue)) /
                        100;
            }
            advanceAmount = Math.min(advanceAmount, Number(plan.price));
        }
        const bookingNumber = await (0, bookingNumber_1.generateBookingNumber)();
        const booking = await prisma_1.default.booking.create({
            data: {
                bookingNumber,
                customerName: customerName.trim(),
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                location: location.trim(),
                bookingDate: parsedDate,
                bookingTime: bookingTime?.trim() || null,
                planId: numericPlanId,
                totalAmount: plan.price,
                advanceAmount,
                paymentStatus: "PENDING",
                bookingStatus: "PENDING",
                paymentScreenshot: paymentScreenshot || null,
                requirements: requirements?.trim() || null,
            },
            include: {
                plan: true,
            },
        });
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: {
                id: booking.id,
                bookingNumber: booking.bookingNumber,
                customerName: booking.customerName,
                phone: booking.phone,
                email: booking.email,
                location: booking.location,
                bookingDate: booking.bookingDate,
                bookingTime: booking.bookingTime,
                plan: booking.plan.name,
                totalAmount: booking.totalAmount,
                advanceAmount: booking.advanceAmount,
                paymentStatus: booking.paymentStatus,
                bookingStatus: booking.bookingStatus,
                requirements: booking.requirements,
            },
        });
    }
    catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
        });
    }
};
exports.createBooking = createBooking;
const getBookings = async (_req, res) => {
    try {
        const bookings = await prisma_1.default.booking.findMany({
            include: {
                plan: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    }
    catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
        });
    }
};
exports.getBookings = getBookings;
const getBookingById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
            return;
        }
        const booking = await prisma_1.default.booking.findUnique({
            where: {
                id,
            },
            include: {
                plan: true,
            },
        });
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        res.json({
            success: true,
            booking,
        });
    }
    catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch booking",
        });
    }
};
exports.getBookingById = getBookingById;
const updateBooking = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
            return;
        }
        const existingBooking = await prisma_1.default.booking.findUnique({
            where: { id },
        });
        if (!existingBooking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        const { bookingStatus, paymentStatus, bookingDate, bookingTime, requirements, } = req.body;
        const updateData = {};
        if (bookingStatus !== undefined) {
            const allowedStatuses = [
                "PENDING",
                "CONFIRMED",
                "IN_PROGRESS",
                "COMPLETED",
                "CANCELLED",
                "REJECTED",
            ];
            if (!allowedStatuses.includes(bookingStatus)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid booking status",
                });
                return;
            }
            updateData.bookingStatus = bookingStatus;
        }
        if (paymentStatus !== undefined) {
            const allowedPaymentStatuses = [
                "PENDING",
                "PARTIAL",
                "PAID",
                "FAILED",
            ];
            if (!allowedPaymentStatuses.includes(paymentStatus)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid payment status",
                });
                return;
            }
            updateData.paymentStatus = paymentStatus;
        }
        if (bookingDate !== undefined) {
            const date = new Date(bookingDate);
            if (Number.isNaN(date.getTime())) {
                res.status(400).json({
                    success: false,
                    message: "Invalid booking date",
                });
                return;
            }
            updateData.bookingDate = date;
        }
        if (bookingTime !== undefined) {
            updateData.bookingTime =
                bookingTime || null;
        }
        if (requirements !== undefined) {
            updateData.requirements =
                requirements || null;
        }
        const booking = await prisma_1.default.booking.update({
            where: {
                id,
            },
            data: updateData,
            include: {
                plan: true,
            },
        });
        res.json({
            success: true,
            message: "Booking updated successfully",
            booking,
        });
    }
    catch (error) {
        console.error("Update booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update booking",
        });
    }
};
exports.updateBooking = updateBooking;
/**
 * Attach uploaded payment screenshot
 * to an existing booking.
 */
const attachPaymentScreenshot = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { paymentScreenshot } = req.body;
        if (!Number.isInteger(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
            return;
        }
        if (!paymentScreenshot ||
            typeof paymentScreenshot !== "string") {
            res.status(400).json({
                success: false,
                message: "Payment screenshot URL is required",
            });
            return;
        }
        const booking = await prisma_1.default.booking.findUnique({
            where: {
                id,
            },
        });
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        const updatedBooking = await prisma_1.default.booking.update({
            where: {
                id,
            },
            data: {
                paymentScreenshot,
                paymentStatus: "PARTIAL",
            },
            include: {
                plan: true,
            },
        });
        res.json({
            success: true,
            message: "Payment screenshot attached successfully",
            booking: updatedBooking,
        });
    }
    catch (error) {
        console.error("Attach payment screenshot error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to attach payment screenshot",
        });
    }
};
exports.attachPaymentScreenshot = attachPaymentScreenshot;
