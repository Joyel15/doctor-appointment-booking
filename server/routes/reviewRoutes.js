import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
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

// Update a review (patients only)
router.put("/:id", authMiddleware, roleMiddleware("patient"), updateReview);

// Delete a review (patients only)
router.delete("/:id", authMiddleware, roleMiddleware("patient"), deleteReview);

// Get reviews (patients only)
router.get("/my", authMiddleware, roleMiddleware("patient"), getMyReviews);

export default router;