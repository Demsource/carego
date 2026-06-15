import { Router } from "express";
import {
  getAllServices,
  getServiceNamesOnly,
} from "../controllers/serviceController.js";

const router = Router();

router.get("/", getAllServices);
router.get("/names", getServiceNamesOnly);

export default router;
