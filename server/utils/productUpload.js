import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const ProductUpload = () => {
  // Ensure upload folder exists
  if (!fs.existsSync("files")) fs.mkdirSync("files");

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "files"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const originalName = path.basename(file.originalname, ext);
      const uniqueName = `${originalName}-${crypto.randomUUID()}${ext}`;
      cb(null, uniqueName);
    },
  });

  // Allowed extensions for images and archives
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const archiveExtensions = [".zip", ".7z", ".rar", ".tar", ".gz"];

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === "productImage") {
      imageExtensions.includes(path.extname(file.originalname).toLowerCase())
        ? cb(null, true)
        : cb(new Error(`Only images allowed: ${imageExtensions.join(", ")}`));
    } else if (file.fieldname === "productZipFile") {
      archiveExtensions.includes(path.extname(file.originalname).toLowerCase())
        ? cb(null, true)
        : cb(new Error(`Only archives allowed: ${archiveExtensions.join(", ")}`));
    } else {
      cb(new Error("Invalid file field"));
    }
  };

  return multer({ storage, fileFilter });
};

export default ProductUpload;
