import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Protect routes based on authentication and user role
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Redirect unauthenticated users to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users without the required role
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized, render the protected content
  return children;
};

export default ProtectedRoute;