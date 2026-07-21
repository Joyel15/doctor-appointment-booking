import Doctor from "../models/Doctor.js";
import Review from "../models/Review.js";

// Allow a logged-in user to submit a doctor application
export const applyDoctor = async (req,res) => {
  try{
    // Extract doctor profile details from request body
    const { specialization, experience, fees, availability, bio } = req.body;

    // Get the authenticated user's ID from authMiddleware
    const doctorId = req.user.id;

    // Prevent multiple doctor applications from the same user
    const existingDoctor = await Doctor.findOne({ doctorId });

    if(existingDoctor){
      return res.status(400).json({
        message : "Already applied",
      });
    }

    // Create a new doctor profile with pending approval
    const doctor = await Doctor.create({
      doctorId,
      specialization,
      experience,
      fees,
      availability,
      bio,
      isApproved: false,
    });

    // Return the newly created doctor profile
    res.status(201).json({
      message: "Application submitted successfully",
      doctor,
    });

  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Retrieve all approved doctors (public endpoint)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true }).populate(
      "doctorId",
      "name email phone profilePic"
    );

    // Compute average rating + review count per doctor
    const doctorsWithRatings = await Promise.all(
      doctors.map(async (doctor) => {
        const reviews = await Review.find({ doctorId: doctor._id });

        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : null;

        return {
          ...doctor.toObject(),
          avgRating: avgRating ? Number(avgRating.toFixed(1)) : null,
          reviewCount: reviews.length,
        };
      })
    );

    res.status(200).json(doctorsWithRatings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Retrieve a doctor's profile by ID (public endpoint)
export const getDoctorById = async (req,res) => {
 try {
  // Extract the doctor's Id from URL parameters
  const { id } = req.params ;

  // Find the doctor and include selected user information
  const doctor = await Doctor.findOne({
     _id: id,
  isApproved: true,
 }).populate(
    "doctorId",
    "name email profilePic phone"
  );

  // Return 404 if no doctor exists with the given Id
  if(!doctor){
    return res.status(404).json({
     message : "Doctor not found",  
    })
  };

  // Return the doctor's profile
  res.status(200).json(doctor);

 } catch(error) {
  return res.status(500).json({
    message : "Server error",
    error : error.message,
  });
 }
};


// Update the logged-in doctor's profile
export const updateDoctor = async (req, res) => {
  try {
    // Get the doctor profile ID from the URL
    const { id } = req.params;

    // Find the doctor profile
    const doctor = await Doctor.findById(id);

    // Return 404 if the profile doesn't exist
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Ensure the authenticated user owns this doctor profile
    if (doctor.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this profile",
      });
    }

    // Prevent updates to admin-controlled fields
    const { isApproved, ...updateData } = req.body;

    // Update the doctor's profile and return the updated document
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate(
      "doctorId",
      "name email profilePic phone"
    );

    // Send the updated profile
    res.status(200).json(updatedDoctor);

  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


  // Get logged-in doctor's own profile
 export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ doctorId: userId }).populate(
      "doctorId",
      "name email phone profilePic"
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found.",
      });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    console.error("Get doctor profile error:", error);
    return res.status(500).json({
      message: "Failed to fetch doctor profile.",
    });
  }
};