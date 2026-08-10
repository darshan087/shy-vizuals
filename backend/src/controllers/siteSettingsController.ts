import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getSiteSettings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
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
  } catch (error) {
    console.error("Get site settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get site settings",
    });
  }
};

export const updateSiteSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      businessName,
      email,
      phone,
      tagline,
      logoUrl,
    } = req.body;

    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          businessName:
            businessName?.trim() || "Shy.Vizuals",
          email:
            email?.trim() || "shyvizuals@gmail.com",
          phone: phone?.trim() || "",
          tagline: tagline?.trim() || null,
          logoUrl: logoUrl || null,
        },
      });
    } else {
      settings = await prisma.siteSettings.update({
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
            tagline:
              tagline === null
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
  } catch (error) {
    console.error("Update site settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update site settings",
    });
  }
};