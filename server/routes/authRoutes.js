import express from "express";
import { registerUser } from "../controllers/authController.js";

// Create a new router for authentication-related routes
const router = express.Router();

// Register a new user
// POST /api/auth/register (when mounted in server.js)
router.post("/register",registerUser);

export default router;