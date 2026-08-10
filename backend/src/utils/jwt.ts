import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shy-vizuals-development-secret";

export interface OwnerTokenPayload {
  userId: number;
  email: string;
  role: string;
}

export const generateToken = (payload: OwnerTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): OwnerTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as OwnerTokenPayload;
};