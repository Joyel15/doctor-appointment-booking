import User from '../models/User.js';
import bcrypt from "bcryptjs";

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