import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const ImageUpload = () => {
  if (!fs.existsSync("images")) {
    fs.mkdirSync("images");
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${crypto.randomUUID()}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 },
  });
};

export default ImageUpload;
