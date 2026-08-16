import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import planRoutes from "./routes/planRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import paymentSettingsRoutes from "./routes/paymentSettingsRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import path from "path";
import dashboardRoutes from "./routes/dashboardRoutes";
import ownerPlanRoutes from "./routes/ownerPlanRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import siteSettingsRoutes from "./routes/siteSettingsRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === "http://localhost:3000" ||
        origin === "https://shy-vizuals.vercel.app" ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Shy.Vizuals API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment-settings", paymentSettingsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use("/api/owner/dashboard", dashboardRoutes);
app.use("/api/owner/plans", ownerPlanRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/site-settings", siteSettingsRoutes);

export default app;