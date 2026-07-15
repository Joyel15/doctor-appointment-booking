import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";

const BookAppointment = () => {
  // Doctor id comes from the URL
  const { doctorId } = useParams();

  // Used to redirect after successful booking
  const navigate = useNavigate();

  // Stores doctor details
  const [doctor, setDoctor] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Error message while loading doctor details
  const [error, setError] = useState("");

  // Appointment form
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    reason: "",
  });

  // -----------------------------
  // Fetch doctor details
  // -----------------------------
  const fetchDoctor = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/doctors/${doctorId}`);

      setDoctor(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load doctor details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor once when page loads
  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  // -----------------------------
  // Update form fields
  // -----------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // -----------------------------
  // Submit booking
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double clicks
    if (submitting) return;

    // Basic validation
    if (!formData.date || !formData.timeSlot.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post("/appointments/book", {
        doctorId,
        date: formData.date,
        timeSlot: formData.timeSlot.trim(),
        reason: formData.reason.trim(),
      });

      toast.success("Appointment booked successfully");

      // Redirect to patient's appointments page
      navigate("/patient/appointments");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to book appointment."
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
      <div className="px-4 py-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  // -----------------------------
  // Doctor not found
  // -----------------------------
  if (!doctor) {
    return (
      <div className="px-4 py-10 text-center text-gray-600">
        Doctor not found.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Book Appointment
      </h1>

      {/* Doctor information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
          {doctor.doctorId?.name?.charAt(0) || "D"}
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            Dr. {doctor.doctorId?.name}
          </h2>

          <p className="text-sm text-gray-500">
            {doctor.specialization} • ₹{doctor.fees}
          </p>
        </div>
      </div>

      {/* Appointment booking form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-4"
      >
        {/* Appointment date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium mb-1"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Appointment time */}
        <div>
          <label
            htmlFor="timeSlot"
            className="block text-sm font-medium mb-1"
          >
            Time Slot
          </label>

          <input
            id="timeSlot"
            type="text"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            required
            placeholder="e.g. 10:00 AM - 10:30 AM"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Optional reason */}
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium mb-1"
          >
            Reason for Visit (optional)
          </label>

          <textarea
            id="reason"
            name="reason"
            rows={4}
            value={formData.reason}
            onChange={handleChange}
            placeholder="Briefly describe your symptoms..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Booking Appointment..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;