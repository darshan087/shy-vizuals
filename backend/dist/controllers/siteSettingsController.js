"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSiteSettings = exports.getSiteSettings = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getSiteSettings = async (_req, res) => {
    try {
        let settings = await prisma_1.default.siteSettings.findFirst();
        if (!settings) {
            settings = await prisma_1.default.siteSettings.create({
                data: {
                    businessName: "Shy.Vizuals",
                    email: "shyvizuals@gmail.com",
                    phone: "",
                    tagline: "Turning moments into cinematic stories.",
                    logoUrl: null,
                },
            });
        }
        res.json({
            success: true,
            settings,
        });
    }
    catch (error) {
        console.error("Get site settings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get site settings",
        });
    }
};
exports.getSiteSettings = getSiteSettings;
const updateSiteSettings = async (req, res) => {
    try {
        const { businessName, email, phone, tagline, logoUrl, } = req.body;
        let settings = await prisma_1.default.siteSettings.findFirst();
        if (!settings) {
            settings = await prisma_1.default.siteSettings.create({
                data: {
                    businessName: businessName?.trim() || "Shy.Vizuals",
                    email: email?.trim() || "shyvizuals@gmail.com",
                    phone: phone?.trim() || "",
                    tagline: tagline?.trim() || null,
                    logoUrl: logoUrl || null,
                },
            });
        }
        else {
            settings = await prisma_1.default.siteSettings.update({
                where: {
                    id: settings.id,
                },
                data: {
                    ...(businessName !== undefined && {
                        businessName: String(businessName).trim(),
                    }),
                    ...(email !== undefined && {
                        email: String(email).trim(),
                    }),
                    ...(phone !== undefined && {
                        phone: String(phone).trim(),
                    }),
                    ...(tagline !== undefined && {
                        tagline: tagline === null
                            ? null
                            : String(tagline).trim(),
                    }),
                    ...(logoUrl !== undefined && {
                        logoUrl: logoUrl || null,
                    }),
                },
            });
        }
        res.json({
            success: true,
            message: "Site settings updated successfully",
            settings,
        });
    }
    catch (error) {
        console.error("Update site settings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update site settings",
        });
    }
};
exports.updateSiteSettings = updateSiteSettings;
