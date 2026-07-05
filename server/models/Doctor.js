import mongoose from "mongoose";

// Schema to store additional information for users with the "doctor" role
const doctorSchema = new mongoose.Schema(
  {
    // Reference to the corresponding user account
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },
    
    availability: [
      {
        day: {
          type: String,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],

    isApproved: {
      type: Boolean,
      default: false,
    },

    bio: {
      type: String,
    },
    
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;