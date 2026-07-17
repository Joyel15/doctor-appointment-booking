const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">

      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">
          Dr.{" "}
          {appointment.doctorId?.doctorId?.name ||
            appointment.doctorId?.specialization ||
            "N/A"}
        </h3>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
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

      {appointment.reason && (
        <p className="text-sm text-gray-600 mt-1 truncate">
          {appointment.reason}
        </p>
      )}

    </div>
  );
};

export default AppointmentCard;