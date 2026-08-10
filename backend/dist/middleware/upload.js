"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaUpload = exports.paymentQrUpload = exports.logoUpload = exports.planImageUpload = exports.paymentScreenshotUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createStorage = (folder) => {
    const uploadDirectory = path_1.default.join(process.cwd(), "uploads", folder);
    if (!fs_1.default.existsSync(uploadDirectory)) {
        fs_1.default.mkdirSync(uploadDirectory, {
            recursive: true,
        });
    }
    return multer_1.default.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDirectory);
        },
        filename: (_req, file, cb) => {
            const extension = path_1.default.extname(file.originalname);
            const filename = `${folder}-${Date.now()}-${Math.round(Math.random() * 1000000)}${extension}`;
            cb(null, filename);
        },
    });
};
const imageFilter = (_req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }
};
const mediaFilter = (_req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, PNG, WEBP, MP4, WEBM and MOV files are allowed"));
    }
};
exports.paymentScreenshotUpload = (0, multer_1.default)({
    storage: createStorage("payments"),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
exports.planImageUpload = (0, multer_1.default)({
    storage: createStorage("plans"),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
exports.logoUpload = (0, multer_1.default)({
    storage: createStorage("logo"),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
/*
 * OWNER PAYMENT QR UPLOAD
 *
 * Stores QR scanner images in:
 * backend/uploads/payment-qr/
 */
exports.paymentQrUpload = (0, multer_1.default)({
    storage: createStorage("payment-qr"),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
exports.mediaUpload = (0, multer_1.default)({
    storage: createStorage("media"),
    fileFilter: mediaFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});
