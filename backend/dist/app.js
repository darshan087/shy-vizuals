"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const planRoutes_1 = __importDefault(require("./routes/planRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const paymentSettingsRoutes_1 = __importDefault(require("./routes/paymentSettingsRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const path_1 = __importDefault(require("path"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const ownerPlanRoutes_1 = __importDefault(require("./routes/ownerPlanRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const siteSettingsRoutes_1 = __importDefault(require("./routes/siteSettingsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Shy.Vizuals API is running",
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/plans", planRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.use("/api/payment-settings", paymentSettingsRoutes_1.default);
app.use("/api/uploads", uploadRoutes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use("/api/owner/dashboard", dashboardRoutes_1.default);
app.use("/api/owner/plans", ownerPlanRoutes_1.default);
app.use("/api/media", mediaRoutes_1.default);
app.use("/api/site-settings", siteSettingsRoutes_1.default);
exports.default = app;
