"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerAuth = void 0;
const jwt_1 = require("../utils/jwt");
const ownerAuth = (req, res, next) => {
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
        const decoded = (0, jwt_1.verifyToken)(token);
        if (decoded.role !== "OWNER") {
            res.status(403).json({
                success: false,
                message: "Owner access required",
            });
            return;
        }
        req.owner = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.ownerAuth = ownerAuth;
