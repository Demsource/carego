import { Router } from "express";
import { loginUser } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/login (Expects application/json raw body)
router.post("/login", loginUser);

export default router;
