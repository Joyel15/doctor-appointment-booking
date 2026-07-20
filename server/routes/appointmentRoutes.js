  import express from "express";
  import {
    bookAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    getBookedSlots,
  } from "../controllers/appointmentController.js";

  import authMiddleware from "../middleware/authMiddleware.js";
  import roleMiddleware from "../middleware/roleMiddleware.js";

  // Create an Express router for appointment-related endpoints
  const router = express.Router();

  // Allow a patient to book a new appointment
  router.post(
    "/book",
    authMiddleware,
    roleMiddleware("patient"),
    bookAppointment
  );

  // Retrieve all appointments for the authenticated patient
  router.get(
    "/patient",
    authMiddleware,
    roleMiddleware("patient"),
    getPatientAppointments
  );

  // Retrieve all appointments for the authenticated doctor
  router.get(
    "/doctor",
    authMiddleware,
    roleMiddleware("doctor"),
    getDoctorAppointments
  );

  // Allow patient and doctor to update the status of one of their appointments
  router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("patient","doctor"),
    updateAppointmentStatus
  );

  // Get booked slots for a doctor on a specific date (public)
  router.get("/slots/:doctorId", getBookedSlots);

  export default router;