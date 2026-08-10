"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOwner = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
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
        const passwordMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!passwordMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid owner credentials",
            });
            return;
        }
        const token = (0, jwt_1.generateToken)({
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
    }
    catch (error) {
        console.error("Owner login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.loginOwner = loginOwner;
