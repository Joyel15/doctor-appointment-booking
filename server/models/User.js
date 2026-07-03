import mongoose from "mongoose";

// Define the schema for user documents
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    phone: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;
