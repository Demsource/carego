import { Router } from "express";
import { registerNurse } from "../controllers/nurseRegistrationController.js";
import { loginNurse } from "../controllers/nurseAuthController.js";
import { upload } from "../utils/fileUpload.js";
import {
  getAllNursesList,
  getPopularNursesList,
} from "../controllers/nurseFetchController.js";

const router = Router();

// Expecting 1 profile photo and up to 10 diploma documents
const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "diplomas", maxCount: 10 },
]);

// POST /api/nurses/register
// // Expects: multipart/form-data (contains 'photo' and 'diplomas' files + stringified JSON arrays for arrays)
router.post("/register", uploadFields, registerNurse);

// Fetch Popular/Top Nurses
router.get("/popular", getPopularNursesList);
// Get all nurses route (GET /api/nurses)
router.get("/", getAllNursesList);

export default router;
