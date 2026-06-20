import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import nurseRoutes from "./routes/nurseRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS Middleware
app.use(
  cors({
    origin: "*", // Allows access from any origin. For production, to be replaced with the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Serve static files from the uploads/photos directory statically for profile pictures
// so the files can actually be accessed via a browser or front-end
app.use(
  "/uploads/photos",
  express.static(path.join(__dirname, "../uploads/photos")),
);

// Routes
app.use("/api/services", serviceRoutes);

app.use("/api/nurses", nurseRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("CareGo Back-End is running perfectly");
});

// Global Error Handler
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
});
