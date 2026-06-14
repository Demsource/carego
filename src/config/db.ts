import mangoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI || "";

  if (!MONGODB_URI) {
    console.error("MONGO_URI is missing from your environment variables");
    process.exit(1);
  }

  try {
    mangoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed. Server not started:", error);
    process.exit(1); // Kill the app so Render knows the deploy failed
  }
};
