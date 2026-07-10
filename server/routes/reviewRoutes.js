import express from "express";
import {
  createReview,
  getDoctorReviews,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// Create an Express router for review-related endpoints
const router = express.Router();

// Submit a review for a completed appointment (Patients only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("patient"),
  createReview
);

// Retrieve all reviews for a specific doctor (Public)
router.get("/doctor/:id", getDoctorReviews);

export default router;