import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext.jsx";
import axios from "../../api/axios.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      // Save authenticated user and access token
      login(res.data.user, res.data.accessToken);

      toast.success("Logged in successfully");

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
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white/95 rounded-2xl shadow-lg p-8 sm:p-10">
        {/* Logo/brand mark */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FaLock size={20} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Log in to manage your appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-gray-700">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
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
                placeholder="Enter your Email"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-gray-700">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
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
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;