import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getOwnerDashboard = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      rejectedBookings,
      revenueResult,
      paidResult,
      pendingPaymentResult,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),

      prisma.booking.count({
        where: { bookingStatus: "PENDING" },
      }),

      prisma.booking.count({
        where: { bookingStatus: "CONFIRMED" },
      }),

      prisma.booking.count({
        where: { bookingStatus: "IN_PROGRESS" },
      }),

      prisma.booking.count({
        where: { bookingStatus: "COMPLETED" },
      }),

      prisma.booking.count({
        where: { bookingStatus: "CANCELLED" },
      }),

      prisma.booking.count({
        where: { bookingStatus: "REJECTED" },
      }),

      prisma.booking.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          bookingStatus: {
            notIn: ["CANCELLED", "REJECTED"],
          },
        },
      }),

      prisma.booking.aggregate({
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

      prisma.booking.aggregate({
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

      prisma.booking.findMany({
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
          totalRevenue:
            revenueResult._sum.totalAmount ?? 0,

          advanceReceived:
            paidResult._sum.advanceAmount ?? 0,

          pendingAdvance:
            pendingPaymentResult._sum.advanceAmount ?? 0,
        },

        recentBookings,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load owner dashboard",
    });
  }
};