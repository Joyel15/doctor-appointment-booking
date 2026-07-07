import { v2 as cloudinary } from "cloudinary";


// Configure Cloudinary using environment variables
cloudinary.config({
  // Cloudinary account name
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  // API key for authentication
  api_key: process.env.CLOUDINARY_API_KEY,

  // Secret key used to authorize requests
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export the configured Cloudinary instance
export default cloudinary;