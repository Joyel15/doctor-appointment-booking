import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const EditProfile = () => {
  const { user, login, token } = useAuth();

  // Doctor profile id needed for doctor-specific update
  const [doctorProfileId, setDoctorProfileId] = useState(null);

  // Personal info form
  const [personalData, setPersonalData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  // Doctor professional form
  const [doctorData, setDoctorData] = useState({
    specialization: "",
    experience: "",
    fees: "",
    bio: "",
  });

  // Profile picture
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch doctor profile
  // -----------------------------
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/doctors/me");
      const doctor = res.data;

      setDoctorProfileId(doctor._id);

      setDoctorData({
        specialization: doctor.specialization || "",
        experience: doctor.experience || "",
        fees: doctor.fees || "",
        bio: doctor.bio || "",
      });

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pre-fill personal data from AuthContext
    if (user) {
      setPersonalData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
      setPreviewUrl(user.profilePic || null);
    }

    fetchProfile();
  }, []);

  // -----------------------------
  // Handle input changes
  // -----------------------------
  const handlePersonalChange = (e) => {
    setPersonalData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDoctorChange = (e) => {
    setDoctorData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // -----------------------------
  // Submit personal info + photo + password
  // -----------------------------
  const handlePersonalSubmit = async (e) => {
    e.preventDefault();

    if (personalData.newPassword && !personalData.currentPassword) {
      toast.error("Enter your current password to set a new one");
      return;
    }

    setSavingPersonal(true);
    try {
      const data = new FormData();
      data.append("name", personalData.name);
      data.append("phone", personalData.phone);

      if (personalData.currentPassword && personalData.newPassword) {
        data.append("currentPassword", personalData.currentPassword);
        data.append("newPassword", personalData.newPassword);
      }

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      const res = await axios.put("/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Personal info updated successfully");

      // Update AuthContext with new user data
      login(res.data, token);

      // Clear password fields
      setPersonalData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update personal info");
    } finally {
      setSavingPersonal(false);
    }
  };

  // -----------------------------
  // Submit doctor professional info
  // -----------------------------
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();

    if (!doctorData.specialization.trim()) {
      return toast.error("Specialization is required.");
    }
    if (Number(doctorData.experience) < 0) {
      return toast.error("Experience cannot be negative.");
    }
    if (Number(doctorData.fees) < 0) {
      return toast.error("Consultation fee cannot be negative.");
    }

    setSavingDoctor(true);
    try {
      await axios.put(`/doctors/${doctorProfileId}`, {
        ...doctorData,
        experience: Number(doctorData.experience),
        fees: Number(doctorData.fees),
      });

      toast.success("Professional info updated successfully");
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update professional info");
    } finally {
      setSavingDoctor(false);
    }
  };

  if (loading) {
    return <div className="px-4 py-10"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProfile}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Edit Profile
      </h1>

      {/* ======= PERSONAL INFO FORM ======= */}
      <form
        onSubmit={handlePersonalSubmit}
        className="bg-white rounded-xl shadow-sm p-6 space-y-5"
      >
        <h2 className="font-semibold text-gray-900 text-lg border-b pb-2">
          Personal Information
        </h2>

        {/* Profile picture */}
        <div className="flex flex-col items-center">
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
            {previewUrl ? "Change photo" : "Upload photo"}
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={personalData.name}
            onChange={handlePersonalChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={personalData.phone}
            onChange={handlePersonalChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Change Password */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3 mt-2">
            Change Password (optional)
          </p>
          <div className="space-y-3">
            <input
              type="password"
              name="currentPassword"
              value={personalData.currentPassword}
              onChange={handlePersonalChange}
              placeholder="Current password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="newPassword"
              value={personalData.newPassword}
              onChange={handlePersonalChange}
              placeholder="New password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingPersonal}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {savingPersonal ? "Saving..." : "Save Personal Info"}
        </button>
      </form>

      {/* ======= PROFESSIONAL INFO FORM ======= */}
      <form
        onSubmit={handleDoctorSubmit}
        className="bg-white rounded-xl shadow-sm p-6 space-y-5"
      >
        <h2 className="font-semibold text-gray-900 text-lg border-b pb-2">
          Professional Information
        </h2>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="specialization">
            Specialization
          </label>
          <input
            id="specialization"
            name="specialization"
            type="text"
            value={doctorData.specialization}
            onChange={handleDoctorChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="experience">
            Experience (Years)
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            min="0"
            value={doctorData.experience}
            onChange={handleDoctorChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fees */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="fees">
            Consultation Fee (₹)
          </label>
          <input
            id="fees"
            name="fees"
            type="number"
            min="0"
            value={doctorData.fees}
            onChange={handleDoctorChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={doctorData.bio}
            onChange={handleDoctorChange}
            placeholder="Tell patients about yourself..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={savingDoctor}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {savingDoctor ? "Saving..." : "Save Professional Info"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;