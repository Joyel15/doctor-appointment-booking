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


// Upload buffer to Cloudinary
export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export default cloudinary;