import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folder: string) => {
  const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    folder
  );

  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
      recursive: true,
    });
  }

  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDirectory);
    },

    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname);

      const filename = `${folder}-${Date.now()}-${Math.round(
        Math.random() * 1000000
      )}${extension}`;

      cb(null, filename);
    },
  });
};

const imageFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      )
    );
  }
};

const mediaFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
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
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP, MP4, WEBM and MOV files are allowed"
      )
    );
  }
};

export const paymentScreenshotUpload = multer({
  storage: createStorage("payments"),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const planImageUpload = multer({
  storage: createStorage("plans"),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const logoUpload = multer({
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
export const paymentQrUpload = multer({
  storage: createStorage("payment-qr"),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const mediaUpload = multer({
  storage: createStorage("media"),
  fileFilter: mediaFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});