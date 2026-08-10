"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.toggleMedia = exports.updateMedia = exports.getAllMediaForOwner = exports.getMedia = exports.createMedia = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createMedia = async (req, res) => {
    try {
        const { title, description, mediaType, thumbnailUrl, } = req.body;
        if (!title || !req.file) {
            res.status(400).json({
                success: false,
                message: "Title and media file are required",
            });
            return;
        }
        if (!["IMAGE", "VIDEO"].includes(mediaType)) {
            res.status(400).json({
                success: false,
                message: "Media type must be IMAGE or VIDEO",
            });
            return;
        }
        const fileUrl = `/uploads/media/${req.file.filename}`;
        const media = await prisma_1.default.media.create({
            data: {
                title: String(title).trim(),
                description: description ?? null,
                mediaType,
                fileUrl,
                thumbnailUrl: thumbnailUrl ?? null,
                isActive: true,
            },
        });
        res.status(201).json({
            success: true,
            message: "Media uploaded successfully",
            media,
        });
    }
    catch (error) {
        console.error("Create media error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create media",
        });
    }
};
exports.createMedia = createMedia;
const getMedia = async (_req, res) => {
    try {
        const media = await prisma_1.default.media.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({
            success: true,
            count: media.length,
            media,
        });
    }
    catch (error) {
        console.error("Get media error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get media",
        });
    }
};
exports.getMedia = getMedia;
const getAllMediaForOwner = async (_req, res) => {
    try {
        const media = await prisma_1.default.media.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({
            success: true,
            count: media.length,
            media,
        });
    }
    catch (error) {
        console.error("Get owner media error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get media",
        });
    }
};
exports.getAllMediaForOwner = getAllMediaForOwner;
const updateMedia = async (req, res) => {
    try {
        const mediaId = Number(req.params.id);
        if (!Number.isInteger(mediaId)) {
            res.status(400).json({
                success: false,
                message: "Invalid media ID",
            });
            return;
        }
        const existingMedia = await prisma_1.default.media.findUnique({
            where: {
                id: mediaId,
            },
        });
        if (!existingMedia) {
            res.status(404).json({
                success: false,
                message: "Media not found",
            });
            return;
        }
        const { title, description, thumbnailUrl, isActive, } = req.body;
        const data = {};
        if (title !== undefined) {
            if (!String(title).trim()) {
                res.status(400).json({
                    success: false,
                    message: "Title cannot be empty",
                });
                return;
            }
            data.title = String(title).trim();
        }
        if (description !== undefined) {
            data.description = description;
        }
        if (thumbnailUrl !== undefined) {
            data.thumbnailUrl = thumbnailUrl;
        }
        if (isActive !== undefined) {
            data.isActive =
                isActive === true || isActive === "true";
        }
        const media = await prisma_1.default.media.update({
            where: {
                id: mediaId,
            },
            data,
        });
        res.json({
            success: true,
            message: "Media updated successfully",
            media,
        });
    }
    catch (error) {
        console.error("Update media error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update media",
        });
    }
};
exports.updateMedia = updateMedia;
const toggleMedia = async (req, res) => {
    try {
        const mediaId = Number(req.params.id);
        if (!Number.isInteger(mediaId)) {
            res.status(400).json({
                success: false,
                message: "Invalid media ID",
            });
            return;
        }
        const existingMedia = await prisma_1.default.media.findUnique({
            where: {
                id: mediaId,
            },
        });
        if (!existingMedia) {
            res.status(404).json({
                success: false,
                message: "Media not found",
            });
            return;
        }
        const media = await prisma_1.default.media.update({
            where: {
                id: mediaId,
            },
            data: {
                isActive: !existingMedia.isActive,
            },
        });
        res.json({
            success: true,
            message: media.isActive
                ? "Media activated successfully"
                : "Media deactivated successfully",
            media,
        });
    }
    catch (error) {
        console.error("Toggle media error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to change media status",
        });
    }
};
exports.toggleMedia = toggleMedia;
const deleteMedia = async (req, res) => {
    try {
        const mediaId = Number(req.params.id);
        if (!Number.isInteger(mediaId)) {
            res.status(400).json({
                success: false,
                message: "Invalid media ID",
            });
            return;
        }
        const existingMedia = await prisma_1.default.media.findUnique({
            where: {
                id: mediaId,
            },
        });
        if (!existingMedia) {
            res.status(404).json({
                success: false,
                message: "Media not found",
            });
            return;
        }
        await prisma_1.default.media.delete({
            where: {
                id: mediaId,
            },
        });
        res.json({
            success: true,
            message: "Media deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete media error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete media",
        });
    }
};
exports.deleteMedia = deleteMedia;
