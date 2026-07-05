// Middleware to restrict access based on user roles
// Accepts one or more allowed roles as arguments
const roleMiddleware = (...allowedRoles) => {

  // Return the actual middleware function
  return (req, res, next) => {

    // authMiddleware should already have verified the JWT
    // and attached the decoded user information to req.user
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // User has the required role
    next();
  };
};

export default roleMiddleware;