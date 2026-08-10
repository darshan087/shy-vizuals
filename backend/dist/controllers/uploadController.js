"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPaymentQr = exports.uploadLogo = exports.uploadPlanImage = exports.uploadPaymentScreenshot = void 0;
const uploadPaymentScreenshot = (req, res) => {
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
    }
    catch (error) {
        console.error("Payment screenshot upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload payment screenshot",
        });
    }
};
exports.uploadPaymentScreenshot = uploadPaymentScreenshot;
const uploadPlanImage = (req, res) => {
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
    }
    catch (error) {
        console.error("Plan image upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload plan image",
        });
    }
};
exports.uploadPlanImage = uploadPlanImage;
/*
 * OWNER LOGO UPLOAD
 */
const uploadLogo = (req, res) => {
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
    }
    catch (error) {
        console.error("Logo upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload logo",
        });
    }
};
exports.uploadLogo = uploadLogo;
/*
 * OWNER PAYMENT QR UPLOAD
 */
const uploadPaymentQr = (req, res) => {
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
    }
    catch (error) {
        console.error("Payment QR upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload payment QR",
        });
    }
};
exports.uploadPaymentQr = uploadPaymentQr;
