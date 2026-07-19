import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

// Create a new router for authentication-related routes
const router = express.Router();

// Register a new user (optional profile picture)
router.post("/register", upload.single("profilePic"), registerUser);

// Login user
router.post("/login", loginUser);

// Update logged-in user's profile (name, phone, password, photo)
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile
);

export default router;