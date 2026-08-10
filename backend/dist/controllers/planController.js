"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.createPlan = exports.getPlanById = exports.getPlans = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// Get all active plans
const getPlans = async (_req, res) => {
    try {
        const plans = await prisma_1.default.plan.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                id: "asc",
            },
        });
        res.json({
            success: true,
            plans,
        });
    }
    catch (error) {
        console.error("Get plans error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch plans",
        });
    }
};
exports.getPlans = getPlans;
// Get one plan
const getPlanById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
            return;
        }
        const plan = await prisma_1.default.plan.findUnique({
            where: { id },
        });
        if (!plan) {
            res.status(404).json({
                success: false,
                message: "Plan not found",
            });
            return;
        }
        res.json({
            success: true,
            plan,
        });
    }
    catch (error) {
        console.error("Get plan error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch plan",
        });
    }
};
exports.getPlanById = getPlanById;
// Owner: create plan
const createPlan = async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        if (!name || price === undefined) {
            res.status(400).json({
                success: false,
                message: "Plan name and price are required",
            });
            return;
        }
        const numericPrice = Number(price);
        if (Number.isNaN(numericPrice) || numericPrice < 0) {
            res.status(400).json({
                success: false,
                message: "Invalid price",
            });
            return;
        }
        const plan = await prisma_1.default.plan.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                price: numericPrice,
                imageUrl: imageUrl || null,
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
// Owner: update plan
const updatePlan = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
            return;
        }
        const existingPlan = await prisma_1.default.plan.findUnique({
            where: { id },
        });
        if (!existingPlan) {
            res.status(404).json({
                success: false,
                message: "Plan not found",
            });
            return;
        }
        const { name, description, price, imageUrl, isActive } = req.body;
        const updateData = {};
        if (name !== undefined) {
            updateData.name = String(name).trim();
        }
        if (description !== undefined) {
            updateData.description = description
                ? String(description).trim()
                : null;
        }
        if (price !== undefined) {
            const numericPrice = Number(price);
            if (Number.isNaN(numericPrice) || numericPrice < 0) {
                res.status(400).json({
                    success: false,
                    message: "Invalid price",
                });
                return;
            }
            updateData.price = numericPrice;
        }
        if (imageUrl !== undefined) {
            updateData.imageUrl = imageUrl || null;
        }
        if (isActive !== undefined) {
            updateData.isActive = Boolean(isActive);
        }
        const plan = await prisma_1.default.plan.update({
            where: { id },
            data: updateData,
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
// Owner: delete/deactivate plan
const deletePlan = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
            return;
        }
        const existingPlan = await prisma_1.default.plan.findUnique({
            where: { id },
        });
        if (!existingPlan) {
            res.status(404).json({
                success: false,
                message: "Plan not found",
            });
            return;
        }
        // We deactivate instead of physically deleting because
        // existing bookings may reference this plan.
        await prisma_1.default.plan.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
        res.json({
            success: true,
            message: "Plan deactivated successfully",
        });
    }
    catch (error) {
        console.error("Delete plan error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to deactivate plan",
        });
    }
};
exports.deletePlan = deletePlan;
