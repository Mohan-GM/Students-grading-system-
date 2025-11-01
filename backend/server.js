const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const studentRoutes = require("./routes/studentRoutes");
const fileRoutes = require("./routes/fileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/students", studentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/files", fileRoutes);

// ✅ MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Student Grading Backend is Running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
