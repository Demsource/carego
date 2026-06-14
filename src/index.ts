import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

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

// Routes
app.use("/api/services", serviceRoutes);

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
