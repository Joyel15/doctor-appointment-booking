import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../api/axios.js";

const ApplyDoctor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    fees: "",
    bio: "",
  });

  const [availability, setAvailability] = useState([
    { day: "Monday", startTime: "", endTime: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update a specific field in a specific availability row
  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  // Add a new empty availability row
  const addAvailabilitySlot = () => {
    setAvailability([...availability, { day: "Monday", startTime: "", endTime: "" }]);
  };

  // Remove an availability row by index
  const removeAvailabilitySlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic check — every slot needs both times filled
    const hasIncompleteSlot = availability.some(
      (slot) => !slot.startTime || !slot.endTime
    );
    if (hasIncompleteSlot) {
      toast.error("Please fill in start and end time for all availability slots");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/doctors/apply", { ...formData, availability });
      toast.success("Application submitted successfully");
      navigate("/patient/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to submit application";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Apply to Become a Doctor
      </h1>
      <p className="text-gray-600 mb-8">
        Fill out your professional details below. An admin will review your
        application.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-6"
      >
        {/* Basic details */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="specialization"
            >
              Specialization
            </label>
            <input
              id="specialization"
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              placeholder="e.g. Cardiology"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="experience"
              >
                Experience (years)
              </label>
              <input
                id="experience"
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="fees">
                Consultation Fees (₹)
              </label>
              <input
                id="fees"
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell patients a bit about yourself..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Availability section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium">Availability</label>
            <button
              type="button"
              onClick={addAvailabilitySlot}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              + Add Slot
            </button>
          </div>

          <div className="space-y-3">
            {availability.map((slot, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 rounded-lg p-3"
              >
                <select
                  value={slot.day}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "day", e.target.value)
                  }
                  className="w-full sm:w-36 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "startTime", e.target.value)
                  }
                  required
                  className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <span className="hidden sm:block text-gray-400">to</span>

                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "endTime", e.target.value)
                  }
                  required
                  className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {availability.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAvailabilitySlot(index)}
                    className="text-red-500 text-sm font-medium hover:underline shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyDoctor;