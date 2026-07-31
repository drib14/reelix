import path from "path";
import fs from "fs";
import express from "express";
import multer from "multer";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Magic byte signatures for allowed image types
const MAGIC_BYTES = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  webp_riff: [0x52, 0x49, 0x46, 0x46], // "RIFF" header (WebP starts with RIFF...WEBP)
};

/**
 * Verify file's binary signature matches its claimed type.
 * Returns true if the file header matches JPEG, PNG, or WebP.
 */
const verifyMagicBytes = (filePath) => {
  try {
    const fd = fs.openSync(filePath, "r");
    const buffer = Buffer.alloc(12);
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    // JPEG: starts with FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;

    // PNG: starts with 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;

    // WebP: starts with "RIFF" at 0-3 and "WEBP" at 8-11
    if (
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    ) return true;

    return false;
  } catch {
    return false;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    const sanitizedField = file.fieldname.replace(/[^a-zA-Z0-9]/g, "");
    cb(null, `${sanitizedField}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /^image\/(jpe?g|png|webp)$/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});
const uploadSingleImage = upload.single("image");

router.post("/", authenticate, authorizeAdmin, (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Verify magic bytes match claimed file type
    const filePath = req.file.path;
    if (!verifyMagicBytes(filePath)) {
      // Delete the suspicious file immediately
      try { fs.unlinkSync(filePath); } catch { /* ignore cleanup errors */ }
      return res.status(400).json({
        success: false,
        message: "File signature does not match an allowed image type. Upload rejected.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: `/${filePath.replace(/\\/g, "/")}`,
    });
  });
});

export default router;

