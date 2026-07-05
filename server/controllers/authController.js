import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req,res) => {
  try {
    // Extract user details from the request body
    const { name,email,password,role,phone } = req.body;

    //check if user already exists
    const userExists = await User.findOne({ email });

    if(userExists){
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // create new user
    const user = await User.create({
      name,
      email,
      password : hashedPassword,
      role,
      phone,
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