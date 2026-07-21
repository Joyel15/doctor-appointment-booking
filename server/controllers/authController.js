import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Register a new user
export const registerUser = async (req,res) => {
  try {
    // Extract user details from the request body
    const { name,email,password,phone } = req.body;

    //check if user already exists
    const userExists = await User.findOne({ email });

    if(userExists){
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // Handle optional profile picture
    let profilePic = "";
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "medibook/profiles"
      );
      profilePic = result.secure_url;
    }


    // create new user
    const user = await User.create({
      name,
      email,
      password : hashedPassword,
      role : "patient",
      phone,
      profilePic,
    });

    //send success response
    // Return the newly created user's details (excluding the password)
    res.status(201).json({
      _id:user._id ,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePic: user.profilePic,
    });  
  } catch(error){
      res.status(500).json({ message:'Server error' , error:error.message });
  }
};


// Login
// Authenticate an existing user
export const loginUser = async (req,res) => {
  try {
    // Extract login credentials from request body
    const { email,password } = req.body ;

    // Find by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user){
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If user exists compare the entered password with stored hashed password
    const isMatch = await bcrypt.compare(password,user.password);

    // Return error if password do not match
    if(!isMatch){
      return res.status(400).json({ message:"Invalid credentials" })
    }

    // Generate JWT containing the user's id and role
    const token = jwt.sign(
      { id: user._id , role : user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // Return the token and user details (excluding password)
    res.status(200).json({
      token,
      user : {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      message : "Server Error",
      error : error.message,
    });
  }
};


// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name and phone
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle profile picture upload
    if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "medibook/profiles");
      user.profilePic = result.secure_url;
    } else if (req.body.removePhoto === "true") {
      user.profilePic = "";
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};