import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";

export const loginOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!user || user.role !== "OWNER") {
      res.status(401).json({
        success: false,
        message: "Invalid owner credentials",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid owner credentials",
      });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: "Owner login successful",
      token,
      owner: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Owner login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};