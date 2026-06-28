import mongoose from "mongoose";

export async function connectDB() {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully", dbConnection.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
}
