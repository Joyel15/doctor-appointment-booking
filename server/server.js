import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";

// Create an Express application
const app = express();

// Use the port from the environment variables,
// or default to 5000 if none is provided
const PORT = process.env.PORT || 5000;

const startServer = async () => {
// Establish a connection to the MongoDB database
await connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();