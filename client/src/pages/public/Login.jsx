import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext.jsx";
import axios from "../../api/axios.js";

const Login = () => {
  // Store login form values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Track login request status
  const [loading, setLoading] = useState(false);

  // Authentication context
  const { login } = useAuth();

  // Used to redirect user after successful login
  const navigate = useNavigate();

  // Update form values as user types
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Send login request to backend
      const res = await axios.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      // Save authenticated user and access token
      login(res.data.user, res.data.token);

      toast.success("Logged in successfully");

      // Redirect user based on their role
      switch (res.data.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "doctor":
          navigate("/doctor/dashboard");
          break;

        default:
          navigate("/patient/dashboard");
      }
    } catch (error) {
      // Display backend error or fallback message
      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      toast.error(message);
    } finally {
      // Always stop loading
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8">

        {/* Page title */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          Login
        </h1>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-busy={loading}
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;