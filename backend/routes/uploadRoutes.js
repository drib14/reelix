import path from "path";
import express from "express";
import multer from "multer";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

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
      res.status(400).json({ success: false, message: err.message });
    } else if (req.file) {
      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        image: `/${req.file.path.replace(/\\/g, "/")}`,
      });
    } else {
      res.status(400).json({ success: false, message: "No image file provided" });
    }
  });
});

export default router;
