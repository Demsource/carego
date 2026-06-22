import { Router } from "express";
import { registerNurse } from "../controllers/nurseRegistrationController.js";
import { loginNurse } from '../controllers/nurseAuthController.js';
import { upload } from "../utils/fileUpload.js";

const router = Router();

// Expecting 1 profile photo and up to 10 diploma documents
const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "diplomas", maxCount: 10 },
]);

// POST /api/nurses/register
router.post("/register", uploadFields, registerNurse);

// POST /api/nurses/login (Expects application/json raw body)
router.post("/login", loginNurse);

export default router;
