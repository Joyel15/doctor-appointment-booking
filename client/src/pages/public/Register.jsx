import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import axios from "../../api/axios.js";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      await axios.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white/95 rounded-2xl shadow-lg p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Book trusted doctors in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile picture (optional) */}
          <div className="flex flex-col items-center mb-2">
            <label htmlFor="profilePic" className="cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden mb-2 hover:border-blue-400 transition">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-blue-300" size={24} />
                )}
              </div>
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profilePic"
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              {previewUrl ? "Change photo" : "Upload photo (optional)"}
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="phone">
              Phone
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;