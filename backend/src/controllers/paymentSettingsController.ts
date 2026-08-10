import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getPaymentSettings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    let settings =
      await prisma.paymentSettings.findFirst();

    if (!settings) {
      settings =
        await prisma.paymentSettings.create({
          data: {
            advanceType: "PERCENTAGE",
            advanceValue: 30,
            paymentMessage:
              "Pay the advance amount to confirm your booking.",
          },
        });
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Get payment settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get payment settings",
    });
  }
};

export const updatePaymentSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      upiId,
      qrImageUrl,
      advanceType,
      advanceValue,
      paymentMessage,
    } = req.body;

    if (!advanceType || advanceValue === undefined) {
      res.status(400).json({
        success: false,
        message:
          "Advance type and advance value are required",
      });
      return;
    }

    if (
      !["FIXED", "PERCENTAGE"].includes(
        advanceType
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Advance type must be FIXED or PERCENTAGE",
      });
      return;
    }

    const value = Number(advanceValue);

    if (!Number.isFinite(value) || value < 0) {
      res.status(400).json({
        success: false,
        message: "Invalid advance value",
      });
      return;
    }

    if (
      advanceType === "PERCENTAGE" &&
      value > 100
    ) {
      res.status(400).json({
        success: false,
        message:
          "Percentage cannot be greater than 100",
      });
      return;
    }

    const existingSettings =
      await prisma.paymentSettings.findFirst();

    let settings;

    if (existingSettings) {
      settings =
        await prisma.paymentSettings.update({
          where: {
            id: existingSettings.id,
          },
          data: {
            upiId:
              upiId?.trim() || null,

            qrImageUrl:
              qrImageUrl?.trim() || null,

            advanceType,

            advanceValue: value,

            paymentMessage:
              paymentMessage?.trim() || null,
          },
        });
    } else {
      settings =
        await prisma.paymentSettings.create({
          data: {
            upiId:
              upiId?.trim() || null,

            qrImageUrl:
              qrImageUrl?.trim() || null,

            advanceType,

            advanceValue: value,

            paymentMessage:
              paymentMessage?.trim() || null,
          },
        });
    }

    res.json({
      success: true,
      message:
        "Payment settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "Update payment settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update payment settings",
    });
  }
};