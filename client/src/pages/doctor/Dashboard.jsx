import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

// Status badge colors
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const Dashboard = () => {
  // Logged-in doctor
  const { user } = useAuth();

  // State
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch doctor's appointments
  // -----------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/appointments/doctor");

      setAppointments(res.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load your appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load appointments once when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // -----------------------------
  // Dashboard statistics
  // -----------------------------
  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appt) => appt.status === "pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appt) => appt.status === "confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (appt) => appt.status === "completed"
  ).length;

  // Show only the latest five appointments
  const recentAppointments = appointments.slice(0, 5);

  // Cards displayed at the top
  const stats = [
    {
      label: "Total Appointments",
      value: totalAppointments,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending",
      value: pendingAppointments,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Confirmed",
      value: confirmedAppointments,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Completed",
      value: completedAppointments,
      color: "bg-purple-50 text-purple-700",
    },
  ];

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      {/* Welcome message */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Welcome back, Dr. {user?.name}
      </h1>

      {/* Dashboard statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl p-4 sm:p-6 ${stat.color}`}
          >
            <p className="text-2xl sm:text-3xl font-bold">
              {stat.value}
            </p>

            <p className="text-sm mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick navigation */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Link
          to="/doctor/appointments"
          className="bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Manage Appointments
        </Link>

        <Link
          to="/doctor/profile"
          className="bg-white border border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Edit Profile
        </Link>
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Recent Appointments
          </h2>
        </div>

        {recentAppointments.length === 0 ? (
          <p className="text-center text-gray-600 py-10">
            You don't have any appointments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">
                    Patient
                  </th>

                  <th className="text-left px-6 py-3 font-medium">
                    Date
                  </th>

                  <th className="text-left px-6 py-3 font-medium">
                    Time Slot
                  </th>

                  <th className="text-left px-6 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.patientId?.name || "N/A"}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.date}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.timeSlot}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusStyles[appointment.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;