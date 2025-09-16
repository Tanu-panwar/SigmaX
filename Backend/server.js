import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from './routes/chat.js';
// const session = require("express-session");
// const MongoStrore = require("connect-mongo");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://sigma-x-eight.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming origin:", origin);
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy does not allow access from this origin."), false);
  },
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
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect with DB", err);
  }
};

// const store = MongoStore.create({
//   mongoUrl: process.env.ATLASDB_URL,
//   crypto: {
//     secret: "mysuperpassword",
//   },
//   touchAfter: 24*3600,
// });

// store.on("error", () => {
//   console.log("ERROR in mongo session store", err)
// });

// const sessionOptions = {
//   store,
//   secret: "mysuperpassword",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now()+7*24*60*60*1000,
//     maxAge: 7*24*60*60*1000,
//     httpOnly: true,
//   }
// }

// app.use(session(sessionOptions));
