import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  owner?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const ownerAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const token = authorization.split(" ")[1];

    const decoded = verifyToken(token);

    if (decoded.role !== "OWNER") {
      res.status(403).json({
        success: false,
        message: "Owner access required",
      });
      return;
    }

    req.owner = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};