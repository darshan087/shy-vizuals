import { Request, Response } from "express";
import prisma from "../config/prisma";

// Get all active plans
export const getPlans = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const plans = await prisma.plan.findMany({
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
  } catch (error) {
    console.error("Get plans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
};

// Get one plan
export const getPlanById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
      return;
    }

    const plan = await prisma.plan.findUnique({
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
  } catch (error) {
    console.error("Get plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
    });
  }
};

// Owner: create plan
export const createPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const plan = await prisma.plan.create({
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
  } catch (error) {
    console.error("Create plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create plan",
    });
  }
};

// Owner: update plan
export const updatePlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
      return;
    }

    const existingPlan = await prisma.plan.findUnique({
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

    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      imageUrl?: string | null;
      isActive?: boolean;
    } = {};

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

    const plan = await prisma.plan.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("Update plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update plan",
    });
  }
};

// Owner: delete/deactivate plan
export const deletePlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
      return;
    }

    const existingPlan = await prisma.plan.findUnique({
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
    await prisma.plan.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    res.json({
      success: true,
      message: "Plan deactivated successfully",
    });
  } catch (error) {
    console.error("Delete plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate plan",
    });
  }
};