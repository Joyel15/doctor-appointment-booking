import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const DoctorCard = ({ doctor }) => {
  return (
    <Link
      to={`/doctors/${doctor._id}`}
      className="bg-white/80 border-blue-100 rounded-xl shadow-md hover:ring hover:ring-blue-600 transition-all duration-200 p-6 text-center"
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-blue-600 font-bold text-xl">
        {doctor.doctorId?.name?.charAt(0) || "D"}
      </div>

      <h3 className="font-semibold text-lg">
        Dr. {doctor.doctorId?.name}
      </h3>

      <p className="text-sm text-gray-500 mb-2">
        {doctor.specialization}
      </p>

      {/* Rating */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {doctor.avgRating ? (
          <>
            <FaStar className="text-yellow-400" size={13} />
            <span className="text-sm font-medium text-gray-700">
              {doctor.avgRating}
            </span>
            <span className="text-xs text-gray-400">
              ({doctor.reviewCount})
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-400">No reviews yet</span>
        )}
      </div>

      <p className="text-sm text-gray-600">
        {doctor.experience} years experience
      </p>
    </Link>
  );
};

export default DoctorCard;