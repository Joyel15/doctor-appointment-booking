import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const PatientEditProfile = () => {
  const { user, login, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
      });
      setPreviewUrl(user.profilePic || null);
    }
    setLoading(false);
  }, [user]);

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

    // Only require currentPassword if trying to set a newPassword
    if (formData.newPassword && !formData.currentPassword) {
      toast.error("Enter your current password to set a new one");
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);

      if (formData.currentPassword && formData.newPassword) {
        data.append("currentPassword", formData.currentPassword);
        data.append("newPassword", formData.newPassword);
      }

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      const res = await axios.put("/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully");

      // Refresh auth context with the updated user info (keep existing token)
      login(res.data, token);

      // Clear password fields after successful save
      setFormData({ ...formData, currentPassword: "", newPassword: "" });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Edit Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-4"
      >
        {/* Profile picture */}
        <div className="flex flex-col items-center mb-4">
          <label htmlFor="profilePic" className="cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden mb-2">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400 text-center px-2">
                  Add Photo
                </span>
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
            Change photo
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3 mt-4">
            Change Password (optional)
          </p>

          <div className="space-y-3">
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Current password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default PatientEditProfile;