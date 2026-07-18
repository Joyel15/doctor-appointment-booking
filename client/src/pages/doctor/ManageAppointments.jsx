import Spinner from "../../components/common/Spinner.jsx";
import { useManageAppointments } from "../../hooks/useManageAppointments.js";

// Badge colors for each appointment status
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const ManageAppointments = () => {
  const { appointments, loading, error, updatingId, handleUpdateStatus } =
    useManageAppointments();

  // -----------------------------
  // Render action buttons
  // -----------------------------
  const renderActions = (appointment) => {
    switch (appointment.status) {
      case "pending":
        return (
          <>
            <button
              onClick={() => handleUpdateStatus(appointment._id, "confirmed")}
              disabled={updatingId === appointment._id}
              className="text-green-600 hover:underline disabled:opacity-50"
            >
              Confirm
            </button>

            <button
              onClick={() => handleUpdateStatus(appointment._id, "cancelled")}
              disabled={updatingId === appointment._id}
              className="text-red-600 hover:underline disabled:opacity-50 ml-3"
            >
              Cancel
            </button>
          </>
        );

      case "confirmed":
        return (
          <>
            <button
              onClick={() => handleUpdateStatus(appointment._id, "completed")}
              disabled={updatingId === appointment._id}
              className="text-blue-600 hover:underline disabled:opacity-50"
            >
              Complete
            </button>

            <button
              onClick={() => handleUpdateStatus(appointment._id, "cancelled")}
              disabled={updatingId === appointment._id}
              className="text-red-600 hover:underline disabled:opacity-50 ml-3"
            >
              Cancel
            </button>
          </>
        );

      default:
        return <span className="text-gray-400">No actions</span>;
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
      <div className="px-4 py-10 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Manage Appointments
      </h1>

      {/* Empty state */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-600">
          You don't have any appointments yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3">Patient</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Time Slot</th>
                  <th className="text-left px-6 py-3">Reason</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="border-t border-gray-100">
                    <td className="px-6 py-3">
                      {appointment.patientId?.name || "N/A"}
                    </td>

                    <td className="px-6 py-3">{appointment.date}</td>

                    <td className="px-6 py-3">{appointment.timeSlot}</td>

                    <td className="px-6 py-3 max-w-[180px] truncate">
                      {appointment.reason || "-"}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusStyles[appointment.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      {renderActions(appointment)}
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

export default ManageAppointments;