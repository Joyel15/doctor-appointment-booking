import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";

const EditProfile = () => {
  // Stores the Doctor document id.
  // Needed because update route expects /doctors/:id
  const [doctorProfileId, setDoctorProfileId] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    fees: "",
    bio: "",
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch logged-in doctor's profile
  // -----------------------------
  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Uses JWT to identify the logged-in doctor
      const res = await axios.get("/doctors/me");

      const doctor = res.data;

      // Save doctor document id
      setDoctorProfileId(doctor._id);

      // Populate the form
      setFormData({
        specialization: doctor.specialization || "",
        experience: doctor.experience || "",
        fees: doctor.fees || "",
        bio: doctor.bio || "",
      });

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile once when component loads
  useEffect(() => {
    fetchProfile();
  }, []);

  // -----------------------------
  // Update input fields
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Submit updated profile
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.specialization.trim()) {
      return toast.error("Specialization is required.");
    }

    if (Number(formData.experience) < 0) {
      return toast.error("Experience cannot be negative.");
    }

    if (Number(formData.fees) < 0) {
      return toast.error("Consultation fee cannot be negative.");
    }

    setSubmitting(true);

    try {
      await axios.put(`/doctors/${doctorProfileId}`, {
        ...formData,
        experience: Number(formData.experience),
        fees: Number(formData.fees),
      });

      toast.success("Profile updated successfully.");

      // Refresh profile so frontend always matches database
      fetchProfile();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // Loading state
  // -----------------------------
  if (loading) {
    return (
      <div className="px-4 py-10">
        <Spinner />
      </div>
    );
  }

  // -----------------------------
  // Error state
  // -----------------------------
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

  // -----------------------------
  // Main UI
  // -----------------------------
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-2xl mx-auto">

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Edit Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 space-y-5"
      >
        {/* Specialization */}
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium mb-1"
          >
            Specialization
          </label>

          <input
            id="specialization"
            name="specialization"
            type="text"
            value={formData.specialization}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Experience */}
        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium mb-1"
          >
            Experience (Years)
          </label>

          <input
            id="experience"
            name="experience"
            type="number"
            min="0"
            value={formData.experience}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Fees */}
        <div>
          <label
            htmlFor="fees"
            className="block text-sm font-medium mb-1"
          >
            Consultation Fee (₹)
          </label>

          <input
            id="fees"
            name="fees"
            type="number"
            min="0"
            value={formData.fees}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium mb-1"
          >
            Bio
          </label>

          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell patients about yourself..."
            className="w-full border rounded-lg px-3 py-2 resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>

    </div>
  );
};

export default EditProfile;