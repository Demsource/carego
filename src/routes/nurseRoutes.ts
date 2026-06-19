import { Router } from "express";
import { registerNurse } from "../controllers/nurseController.js";
import { upload } from "../utils/fileUpload.js";

const router = Router();

// Expecting 1 profile photo and up to 10 diploma documents
const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "diplomas", maxCount: 10 },
]);

// POST /api/nurses/register
router.post("/register", uploadFields, registerNurse);

export default router;
