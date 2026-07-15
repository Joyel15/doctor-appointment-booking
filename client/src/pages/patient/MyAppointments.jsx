import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";

// Badge colors for different appointment statuses
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

// Returns the appropriate badge color
const getStatusStyle = (status) =>
  statusStyles[status] || "bg-gray-100 text-gray-700";

// Patients can only cancel pending or confirmed appointments
const canCancelAppointment = (status) =>
  ["pending", "confirmed"].includes(status);

const MyAppointments = () => {
  // Stores all appointments
  const [appointments, setAppointments] = useState([]);

  // Loading indicator
  const [loading, setLoading] = useState(true);

  // Stores fetch error message
  const [error, setError] = useState("");

  // Stores appointment currently being cancelled
  const [cancellingId, setCancellingId] = useState(null);

  // -----------------------------------------
  // Fetch patient's appointments
  // -----------------------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("/appointments/patient");

      setAppointments(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your appointments.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments when page loads
  useEffect(() => {
    fetchAppointments();
  }, []);

  // -----------------------------------------
  // Cancel appointment
  // -----------------------------------------
  const handleCancel = async (appointmentId) => {
    // Ask for confirmation before cancelling
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) return;

    try {
      setCancellingId(appointmentId);

      await axios.put(`/appointments/${appointmentId}`, {
        status: "cancelled",
      });

      toast.success("Appointment cancelled successfully.");

      // Update local state instead of fetching everything again
      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: "cancelled" }
            : appointment,
        ),
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel appointment.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  // -------------------------
  // Loading State
  // -------------------------
  if (loading) {
    return (
      <div className="px-4 py-10">
        <Spinner />
      </div>
    );
  }

  // -------------------------
  // Error State
  // -------------------------
  if (error) {
    return <div className="px-4 py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      {/* Page Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        My Appointments
      </h1>

      {/* Empty State */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <p className="text-gray-600 mb-6">
            You haven't booked any appointments yet.
          </p>

          <Link
            to="/doctors"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Doctors
          </Link>
        </div>
      ) : (
        // Appointment Table
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Table Header */}
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Doctor</th>

                  <th className="text-left px-6 py-3 font-medium">Date</th>

                  <th className="text-left px-6 py-3 font-medium">Time Slot</th>

                  <th className="text-left px-6 py-3 font-medium">Reason</th>

                  <th className="text-left px-6 py-3 font-medium">Status</th>

                  <th className="text-left px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-t border-gray-100"
                  >
                    {/* Doctor */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.doctorId?.doctorId?.name
                        ? `Dr. ${appointment.doctorId.doctorId.name}`
                        : appointment.doctorId?.specialization || "N/A"}
                    </td>

                    {/* Appointment Date */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.date}
                    </td>

                    {/* Appointment Time */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.timeSlot}
                    </td>

                    {/* Appointment Reason */}
                    <td className="px-6 py-3 max-w-[180px] truncate">
                      {appointment.reason?.trim() || "-"}
                    </td>

                    {/* Appointment Status */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Cancel Button */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      {canCancelAppointment(appointment.status) && (
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          disabled={cancellingId === appointment._id}
                          className="text-red-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === appointment._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
