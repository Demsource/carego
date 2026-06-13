import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mangoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "";

// Enable CORS Middleware
app.use(
  cors({
    origin: "*", // Allows access from any origin. For production, to be replaced with the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("CareGo Back-End is running perfectly");
});

mangoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed. Server not started:", err);
    process.exit(1); // Kill the app so Render knows the deploy failed
  });
