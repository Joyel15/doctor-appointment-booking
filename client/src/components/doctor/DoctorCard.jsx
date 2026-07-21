import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <Link
      to={`/doctors/${doctor._id}`}
      className="bg-white/90 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-blue-500 transition-all duration-100 p-6 text-center"
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

      <p className="text-sm text-gray-600">
        {doctor.experience} years of experience
      </p>
    </Link>
  );
};

export default DoctorCard;