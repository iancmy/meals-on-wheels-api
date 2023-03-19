import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import adminRoutes from "./controller/admin.js";
import userRoutes from "./controller/user.js";
import locationRoutes from "./controller/location.js";
import memberRoutes from "./controller/member.js";
import reportRoutes from "./controller/report.js";

// Load environment variables from .env file
dotenv.config();

// Get environment variables
const { DB_USER, DB_PWD } = process.env;

const app = express();

// Connect to database
mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PWD}@meals-on-wheels.jtyw6tx.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Connection failed", err);
  });

// Middleware for parsing JSON data in request body
app.use(express.json());

// Allow cross-origin requests and allow credentials
app.use(cors({ origin: "*", credentials: true }));

// Set up routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/report", reportRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
