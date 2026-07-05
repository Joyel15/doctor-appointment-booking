import jwt from "jsonwebtoken";

// Middleware to protect routes that require authentication
const authMiddleware = (req, res, next) => {
  try {
    // Read the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Ensure the token exists and follows the format: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    // Extract the JWT from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      // Store the decoded user information for later use
      req.user = decoded;

      // Continue to the next middleware or controller
      next();
    });
    
  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export default authMiddleware;