import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaClipboardCheck,
} from "react-icons/fa";
import Spinner from "../../components/common/Spinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import usePatientDashboard from "../../hooks/usePatientDashboard.js";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

// Icon + accent color per stat label
const statIconMap = {
  "Total Appointments": { icon: FaCalendarAlt, color: "text-blue-600", bg: "bg-blue-100" },
  "Pending": { icon: FaHourglassHalf, color: "text-yellow-600", bg: "bg-yellow-100" },
  "Confirmed": { icon: FaCheckCircle, color: "text-green-600", bg: "bg-green-100" },
  "Completed": { icon: FaClipboardCheck, color: "text-purple-600", bg: "bg-purple-100" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const {
    loading,
    error,
    reviewModal,
    setReviewModal,
    reviewData,
    setReviewData,
    submittingReview,
    handleSubmitReview,
    stats,
    recentAppointments,
  } = usePatientDashboard();

  if (loading) {
    return <div className="px-4 py-10"><Spinner /></div>;
  }

  if (error) {
    return <div className="px-4 py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.name}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const iconData = statIconMap[stat.label] || {
            icon: FaCalendarAlt,
            color: "text-gray-600",
            bg: "bg-gray-100",
          };
          const Icon = iconData.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${iconData.bg} ${iconData.color}`}
              >
                <Icon size={16} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick navigation */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Link
          to="/patient/profile"
          className="bg-white border border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Edit Profile
        </Link>
        <Link
          to="/patient/appointments"
          className="bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          View All Appointments
        </Link>
        <Link
          to="/doctors"
          className="bg-white border border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Find Doctors
        </Link>
        <Link
          to="/patient/reviews"
          className="bg-white border border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          My Reviews
        </Link>
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
        </div>

        {recentAppointments.length === 0 ? (
          <p className="text-center text-gray-600 py-10">
            You haven't booked any appointments yet.
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Doctor</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-left px-6 py-3 font-medium">Time Slot</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAppointments.map((appointment, index) => (
                    <tr
                      key={appointment._id}
                      className={`border-t border-gray-100 ${
                        index % 2 === 1 ? "bg-gray-50/50" : ""
                      } hover:bg-blue-50/40 transition-colors`}
                    >
                      <td className="px-6 py-3.5 whitespace-nowrap font-medium text-gray-900">
                        Dr.{" "}
                        {appointment.doctorId?.doctorId?.name ||
                          appointment.doctorId?.name ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-gray-600">
                        {appointment.date}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-gray-600">
                        {appointment.timeSlot}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusStyles[appointment.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        {appointment.status === "completed" && (
                          <button
                            onClick={() => setReviewModal(appointment)}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            Write Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-gray-100">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      Dr.{" "}
                      {appointment.doctorId?.doctorId?.name ||
                        appointment.doctorId?.name ||
                        "N/A"}
                    </p>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                        statusStyles[appointment.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {appointment.date} • {appointment.timeSlot}
                  </p>
                  {appointment.status === "completed" && (
                    <button
                      onClick={() => setReviewModal(appointment)}
                      className="text-blue-600 text-sm font-medium hover:underline mt-2"
                    >
                      Write Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Write a Review</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setReviewData((prev) => ({ ...prev, rating: star }))
                    }
                    className={`text-2xl ${
                      star <= reviewData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Comment (optional)
              </label>
              <textarea
                rows={3}
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Share your experience..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
              <button
                onClick={() => {
                  setReviewModal(null);
                  setReviewData({ rating: 5, comment: "" });
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;