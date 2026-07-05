import express from "express";
import { registerUser , loginUser } from "../controllers/authController.js";

// Create a new router for authentication-related routes
const router = express.Router();

// Register a new user
// POST /api/auth/register (when mounted in server.js)
router.post("/register",registerUser);

// Login user
router.post("/login",loginUser); 

export default router;