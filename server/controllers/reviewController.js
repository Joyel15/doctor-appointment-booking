import Review from "../models/Review.js"
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";


// Create a review for a completed appointment
export const createReview = async (req, res) => {
  try {
    // Extract review details from the request body
    // doctorId is NOT required because it is taken from the appointment
    const { appointmentId, rating, comment } = req.body;

    // Get the authenticated patient's ID
    const patientId = req.user.id;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);

    // Return 404 if the appointment doesn't exist
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Ensure the appointment belongs to the logged-in patient
    if (appointment.patientId.toString() !== patientId) {
      return res.status(403).json({
        message: "Not authorized to review this appointment",
      });
    }

    // Only completed appointments can be reviewed
    if (appointment.status !== "completed") {
      return res.status(400).json({
        message: "Can only review after a completed appointment",
      });
    }

    // Prevent duplicate reviews for the same appointment
    const existingReview = await Review.findOne({ appointmentId });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this appointment",
      });
    }

    // Create the review using the doctor ID from the appointment
    const review = await Review.create({
      patientId,
      doctorId: appointment.doctorId,
      appointmentId,
      rating,
      comment,
    });

    // Return success response
    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });

  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Find the review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ownership check — only the patient who wrote it can update it
    if (review.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    // Update only rating and comment
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ownership check — only the patient who wrote it can delete it
    if (review.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    // Delete the review
    await Review.findByIdAndDelete(id);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Patient reviews
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ patientId: req.user.id })
      .populate({
        path: "doctorId",
        populate: {
          path: "doctorId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Retrieve all reviews for a specific doctor
export const getDoctorReviews = async (req, res) => {
  try {
    // Get the doctor ID from the URL parameters
    const { id: doctorId } = req.params;

    // Check whether the doctor exists
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Find all reviews for this doctor
    // Include the reviewer's name and profile picture
    const reviews = await Review.find({ doctorId })
      .populate("patientId", "name profilePic")
      .sort({ createdAt: -1 });

    // Return the reviews
    return res.status(200).json(reviews);

  } catch (error) {
    // Handle unexpected server errors
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};