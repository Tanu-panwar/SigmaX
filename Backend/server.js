import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",  // ✅ Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use("/api", chatRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

// DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect with DB", err);
  }
};
