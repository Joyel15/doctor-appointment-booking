import express from "express";
import {
  applyDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} from "../controllers/doctorController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// Create an Express router for doctor-related endpoints
const router = express.Router();

// Submit a doctor application (authenticated users only)
router.post("/apply", authMiddleware, applyDoctor);

// Retrieve all approved doctors (public endpoint)
router.get("/", getAllDoctors);

// Retrieve a specific doctor's profile by ID (public endpoint)
router.get("/:id", getDoctorById);

// Update the logged-in doctor's profile
// Requires authentication and the "doctor" role
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  updateDoctor
);

export default router;

