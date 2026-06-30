import express from "express";
import { registerPatient } from "../controllers/patientRegistrationController.js";
import { loginPatient } from "../controllers/patientAuthController.js";

const router = express.Router();

// // POST /api/patients/register
// Patient Registration Route (Handles raw application/json)
router.post("/register", registerPatient);

export default router;
