import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import dotenv from 'dotenv';

// Force load env variables immediately before cloudinary config runs
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPhoto = file.fieldname === "photo";

    return {
      // Group them into clean folders on your Cloudinary dashboard
      folder: isPhoto ? "carego/photos" : "carego/documents",

      // Dynamically extract 'png', 'jpg', 'jpeg', or 'pdf' from the original file name
      format: path.extname(file.originalname).substring(1).toLowerCase(),

      public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,

      // For sensitive documents, require a signed token for access control instead of public delivery
      access_control: isPhoto ? undefined : [{ access_type: "token" }],
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only .png, .jpg, .jpeg, and .pdf formats are allowed!"));
  },
});
