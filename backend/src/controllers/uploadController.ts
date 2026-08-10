import { Request, Response } from "express";

export const uploadPaymentScreenshot = (
  req: Request,
  res: Response
): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Payment screenshot is required",
      });
      return;
    }

    const fileUrl = `/uploads/payments/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: "Payment screenshot uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error(
      "Payment screenshot upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload payment screenshot",
    });
  }
};

export const uploadPlanImage = (
  req: Request,
  res: Response
): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Plan image is required",
      });
      return;
    }

    const fileUrl = `/uploads/plans/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: "Plan image uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error(
      "Plan image upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload plan image",
    });
  }
};

/*
 * OWNER LOGO UPLOAD
 */

export const uploadLogo = (
  req: Request,
  res: Response
): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Logo image is required",
      });
      return;
    }

    const fileUrl = `/uploads/logo/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: "Logo uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error("Logo upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload logo",
    });
  }
};

/*
 * OWNER PAYMENT QR UPLOAD
 */

export const uploadPaymentQr = (
  req: Request,
  res: Response
): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Payment QR image is required",
      });
      return;
    }

    const fileUrl = `/uploads/payment-qr/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: "Payment QR uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error(
      "Payment QR upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload payment QR",
    });
  }
};