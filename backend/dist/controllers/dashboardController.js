"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerDashboard = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getOwnerDashboard = async (_req, res) => {
    try {
        const [totalBookings, pendingBookings, confirmedBookings, inProgressBookings, completedBookings, cancelledBookings, rejectedBookings, revenueResult, paidResult, pendingPaymentResult, recentBookings,] = await Promise.all([
            prisma_1.default.booking.count(),
            prisma_1.default.booking.count({
                where: { bookingStatus: "PENDING" },
            }),
            prisma_1.default.booking.count({
                where: { bookingStatus: "CONFIRMED" },
            }),
            prisma_1.default.booking.count({
                where: { bookingStatus: "IN_PROGRESS" },
            }),
            prisma_1.default.booking.count({
                where: { bookingStatus: "COMPLETED" },
            }),
            prisma_1.default.booking.count({
                where: { bookingStatus: "CANCELLED" },
            }),
            prisma_1.default.booking.count({
                where: { bookingStatus: "REJECTED" },
            }),
            prisma_1.default.booking.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    bookingStatus: {
                        notIn: ["CANCELLED", "REJECTED"],
                    },
                },
            }),
            prisma_1.default.booking.aggregate({
                _sum: {
                    advanceAmount: true,
                },
                where: {
                    paymentStatus: {
                        in: ["PARTIAL", "PAID"],
                    },
                    bookingStatus: {
                        notIn: ["CANCELLED", "REJECTED"],
                    },
                },
            }),
            prisma_1.default.booking.aggregate({
                _sum: {
                    advanceAmount: true,
                },
                where: {
                    paymentStatus: "PENDING",
                    bookingStatus: {
                        notIn: ["CANCELLED", "REJECTED"],
                    },
                },
            }),
            prisma_1.default.booking.findMany({
                take: 10,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    plan: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                },
            }),
        ]);
        res.json({
            success: true,
            dashboard: {
                bookings: {
                    total: totalBookings,
                    pending: pendingBookings,
                    confirmed: confirmedBookings,
                    inProgress: inProgressBookings,
                    completed: completedBookings,
                    cancelled: cancelledBookings,
                    rejected: rejectedBookings,
                },
                money: {
                    totalRevenue: revenueResult._sum.totalAmount ?? 0,
                    advanceReceived: paidResult._sum.advanceAmount ?? 0,
                    pendingAdvance: pendingPaymentResult._sum.advanceAmount ?? 0,
                },
                recentBookings,
            },
        });
    }
    catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load owner dashboard",
        });
    }
};
exports.getOwnerDashboard = getOwnerDashboard;
