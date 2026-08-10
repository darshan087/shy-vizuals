import prisma from "../config/prisma";

export const generateBookingNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const latestBooking = await prisma.booking.findFirst({
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