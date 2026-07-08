import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";

// Create an Express application
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

// Use the port from the environment variables,
// or default to 5000 if none is provided
const PORT = process.env.PORT || 5000;

const startServer = async () => {
// Establish a connection to the MongoDB database
await connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();