import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";

// Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    // Extract appointment details from the request body
    const { doctorId, date, timeSlot, reason } = req.body;

    // Get the authenticated patient's ID
    const patientId = req.user.id;

    // Check whether the selected time slot is already booked
    // Ignore appointments that have been cancelled
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    // Create a new appointment with pending status
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
      status: "pending",
    });

    // Fetch patient details to get their email
    const patient = await User.findById(patientId);

    // Send confirmation email to patient
    await sendEmail(
      patient.email,
      "Appointment Booked Successfully",
      `
        <h2>Your appointment has been booked</h2>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
        <p><strong>Reason:</strong> ${reason || "Not specified"}</p>
        <p><strong>Status:</strong> Pending confirmation from the doctor</p>
      `,
    );

    // Return the newly created appointment
    res.status(201).json({
      message: "Application booked successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Retrieve all appointments for the authenticated patient
export const getPatientAppointments = async (req, res) => {
  try {
    // Get the authenticated patient's ID
    const patientId = req.user.id;

    // Find all appointments for this patient
    // Include selected doctor details and show newest appointments first
    const appointments = await Appointment.find({ patientId })
      .populate({
        path: "doctorId",
        populate: {
          path: "doctorId",
          select: "name email phone profilePic",
        },
      })
      .sort({ createdAt: -1 });

    // Return the patients appointments
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Retrieve all appointments for the authenticated doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    // Find the doctor's profile using the authenticated user's ID
    // (req.user.id refers to the User document, not the Doctor document)
    const doctor = await Doctor.findOne({ doctorId: req.user.id });

    // Return 404 if doctor the profile doesn't exist
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    // Find appointments linked to this doctor's profile
    // Include selected patient information and show newest appointments first
    const appointments = await Appointment.find({
      doctorId: doctor._id,
    })
      .populate("patientId", "name email phone")
      .sort({ createdAt: -1 });

    // Return the doctor's appointments
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update appointment status (doctor confirms/cancels/completes)
export const updateAppointmentStatus = async (req, res) => {
  try {
    // Get appointment ID from URL parameters
    const { id } = req.params;

    // Get the new status from the request body
    const { status } = req.body;

    // Allowed appointment statuses
    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

    // Validate the provided status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    // Find the doctor's profile using the logged-in user's ID
    // (req.user.id refers to the User document)
    const doctor = await Doctor.findOne({ doctorId: req.user.id });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(id);

    // Return 404 if the appointment doesn't exist
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Ensure the appointment belongs to this doctor
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this appointment",
      });
    }

    // Prevent updating to the same status
    if (appointment.status === status) {
      return res.status(400).json({
        message: `Appointment is already ${status}`,
      });
    }

    // Update the appointment status
    appointment.status = status;

    // Save the updated appointment
    await appointment.save();

    // Return success response
    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
