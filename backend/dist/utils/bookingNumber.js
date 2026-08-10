"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookingNumber = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const generateBookingNumber = async () => {
    const year = new Date().getFullYear();
    const latestBooking = await prisma_1.default.booking.findFirst({
        orderBy: {
            id: "desc",
        },
        select: {
            id: true,
        },
    });
    const nextId = (latestBooking?.id || 0) + 1;
    return `SHY-${year}-${String(nextId).padStart(5, "0")}`;
};
exports.generateBookingNumber = generateBookingNumber;
