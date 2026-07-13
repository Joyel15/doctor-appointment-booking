import User from "../models/User.js"
import Doctor from "../models/Doctor.js";
import sendEmail from "../utils/sendEmail.js";

// Retrieve all doctor applications that are awaiting approval
export const getPendingDoctors = async (req, res) => {
  try {
    // Find all doctors who haven't been approved yet
    // Include selected user information
    const doctors = await Doctor.find({
      isApproved: false,
    }).populate(
      "doctorId",
      "name email profilePic phone"
    );

    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Approve a doctor's application
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the doctor profile
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Mark the doctor as approved
    doctor.isApproved = true;
    await doctor.save();

    // Update the linked user's role to "doctor"
     const user = await User.findByIdAndUpdate(
      doctor.doctorId,
      { role: "doctor" },
      { new: true }
    );
    
    // Send approval email to the doctor
    await sendEmail(
      user.email,
      "Your Doctor Application Has Been Approved",
      `
        <h2>Congratulations, ${user.name}!</h2>
        <p>Your application to join as a doctor has been approved.</p>
        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        <p>You can now log in and start managing your appointments.</p>
      `
    );

    return res.status(200).json({
      message: "Doctor approved successfully",
      doctor,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Retrieve all registered users
export const getAllUsers = async (req, res) => {
  try {
    // Exclude passwords from the response
    const users = await User.find().select("-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};`                   `