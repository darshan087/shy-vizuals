"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.togglePlan = exports.updatePlan = exports.createPlan = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createPlan = async (req, res) => {
    try {
        const { name, description, price, imageUrl, isActive, } = req.body;
        if (!name || price === undefined) {
            res.status(400).json({
                success: false,
                message: "Plan name and price are required",
            });
            return;
        }
        const numericPrice = Number(price);
        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            res.status(400).json({
                success: false,
                message: "Invalid price",
            });
            return;
        }
        const plan = await prisma_1.default.plan.create({
            data: {
                name: String(name).trim(),
                description: description ?? null,
                price: numericPrice,
                imageUrl: imageUrl ?? null,
                isActive: isActive !== undefined ? Boolean(isActive) : true,
            },
        });
        res.status(201).json({
            success: true,
            message: "Plan created successfully",
            plan,
        });
    }
    catch (error) {
        console.error("Create plan error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create plan",
        });
    }
};
exports.createPlan = createPlan;
const updatePlan = async (req, res) => {
    try {
        const planId = Number(req.params.id);
        if (!Number.isInteger(planId)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
            return;
        }
        const existingPlan = await prisma_1.default.plan.findUnique({
            where: { id: planId },
        });
        if (!existingPlan) {
            res.status(404).json({
                success: false,
                message: "Plan not found",
            });
            return;
        }
        const { name, description, price, imageUrl, isActive, } = req.body;
        const data = {};
        if (name !== undefined) {
            if (!String(name).trim()) {
                res.status(400).json({
                    success: false,
                    message: "Plan name cannot be empty",
                });
                return;
            }
            data.name = String(name).trim();
        }
        if (description !== undefined) {
            data.description = description;
        }
        if (price !== undefined) {
            const numericPrice = Number(price);
            if (!Number.isFinite(numericPrice) ||
                numericPrice < 0) {
                res.status(400).json({
                    success: false,
                    message: "Invalid price",
                });
                return;
            }
            data.price = numericPrice;
        }
        if (imageUrl !== undefined) {
            data.imageUrl = imageUrl;
        }
        if (isActive !== undefined) {
            data.isActive = Boolean(isActive);
        }
        const plan = await prisma_1.default.plan.update({
            where: { id: planId },
            data,
        });
        res.json({
            success: true,
            message: "Plan updated successfully",
            plan,
        });
    }
    catch (error) {
        console.error("Update plan error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update plan",
        });
    }
};
exports.updatePlan = updatePlan;
const togglePlan = async (req, res) => {
    try {
        const planId = Number(req.params.id);
        if (!Number.isInteger(planId)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
            return;
        }
        const existingPlan = await prisma_1.default.plan.findUnique({
            where: { id: planId },
        });
        if (!existingPlan) {
            res.status(404).json({
                success: false,
                message: "Plan not found",
            });
            return;
        }
        const plan = await prisma_1.default.plan.update({
            where: { id: planId },
            data: {
                isActive: !existingPlan.isActive,
            },
        });
        res.json({
            success: true,
            message: plan.isActive
                ? "Plan activated successfully"
                : "Plan deactivated successfully",
            plan,
        });
    }
    catch (error) {
        console.error("Toggle plan error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to change plan status",
        });
    }
};
exports.togglePlan = togglePlan;
const deletePlan = async (req, res) => {
    try {
        const planId = Number(req.params.id);
        if (!Number.isInteger(planId)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
            return;
        }
        const existingPlan = await prisma_1.default.plan.findUnique({
            where: { id: planId },
            include: {
                bookings: {
                    select: {
                        id: true,
                    },
                    take: 1,
                },
            },
        });
        if (!existingPlan) {
            res.status(404).json({
                success: false,
                message: "Plan not found",
            });
            return;
        }
        if (existingPlan.bookings.length > 0) {
            res.status(400).json({
                success: false,
                message: "This plan has bookings. Deactivate it instead of deleting it.",
            });
            return;
        }
        await prisma_1.default.plan.delete({
            where: { id: planId },
        });
        res.json({
            success: true,
            message: "Plan deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete plan error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete plan",
        });
    }
};
exports.deletePlan = deletePlan;
