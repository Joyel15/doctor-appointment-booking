import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner.jsx";
import useMyAppointments from "../../hooks/useMyAppointments.js";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const getStatusStyle = (status) =>
  statusStyles[status] || "bg-gray-100 text-gray-700";

const canCancelAppointment = (status) =>
  ["pending", "confirmed"].includes(status);

const MyAppointments = () => {
  const {
    appointments,
    loading,
    error,
    cancellingId,
    reviewModal,
    setReviewModal,
    reviewData,
    setReviewData,
    submittingReview,
    handleCancel,
    handleSubmitReview,
  } = useMyAppointments();

  if (loading) {
    return <div className="px-4 py-10"><Spinner /></div>;
  }

  if (error) {
    return <div className="px-4 py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        My Appointments
      </h1>

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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.doctorId?.doctorId?.name
                        ? `Dr. ${appointment.doctorId.doctorId.name}`
                        : appointment.doctorId?.specialization || "N/A"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.date}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {appointment.timeSlot}
                    </td>
                    <td className="px-6 py-3 max-w-[180px] truncate">
                      {appointment.reason?.trim() || "-"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
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
                      {appointment.status === "completed" && (
                        <button
                          onClick={() => setReviewModal(appointment)}
                          className="text-blue-600 font-medium hover:underline ml-3"
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
        </div>
      )}

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

export default MyAppointments;