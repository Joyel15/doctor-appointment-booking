import express from "express";
import {
  getPendingDoctors,
  approveDoctor,
  getAllUsers,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// Create an Express router for admin-related endpoints
const router = express.Router();

// Retrieve all doctor applications awaiting approval (Admin only)
router.get(
  "/doctors/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingDoctors,
);

// Approve a doctor's application (Admin only)
router.put(
  "/doctors/:id",
  authMiddleware,
  roleMiddleware("admin"),
  approveDoctor,
);

// Retrieve all registered users (Admin only)
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);

export default router;
