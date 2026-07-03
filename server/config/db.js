import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Function to establish a connection with MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from the environment variable
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MONGODB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    // Exit the application with a failure status
    process.exit(1);
  }
};

export default connectDB;
