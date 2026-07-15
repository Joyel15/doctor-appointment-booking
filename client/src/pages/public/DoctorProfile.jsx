import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const DoctorProfile = () => {
  // Get doctor id from the URL
  const { id } = useParams();

  // Logged-in user (used to decide whether booking is allowed)
  const { user } = useAuth();

  // Store doctor's complete profile
  const [doctor, setDoctor] = useState(null);

  // Loading state while fetching doctor data
  const [loading, setLoading] = useState(true);

  // Error message if API request fails
  const [error, setError] = useState("");

  // Fetch doctor profile whenever the URL id changes
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // Request doctor details from backend
        const res = await axios.get(`/doctors/${id}`);

        // Save doctor profile
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor profile:", err);

        setError("Failed to load doctor profile. Please try again later.");
      } finally {
        // Stop loading regardless of success or failure
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // Show spinner while loading
  if (loading) {
    return (
      <div className="px-4 py-10">
        <Spinner />
      </div>
    );
  }

  // Show API error
  if (error) {
    return (
      <div className="px-4 py-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  // Doctor not found
  if (!doctor) {
    return (
      <div className="px-4 py-10 text-center text-gray-600">
        Doctor not found.
      </div>
    );
  }

  // Store availability separately to make JSX cleaner
  const availability = doctor.availability || [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">

        {/* Doctor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">

          {/* Placeholder avatar using first letter of doctor's name */}
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0">
            {doctor.doctorId?.name?.charAt(0) || "D"}
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dr. {doctor.doctorId?.name}
            </h1>

            <p className="text-gray-500">
              {doctor.specialization}
            </p>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-medium text-gray-900">
              {doctor.experience} years
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Consultation Fees</p>
            <p className="font-medium text-gray-900">
              ₹{doctor.fees}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">
              {doctor.doctorId?.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">
              {doctor.doctorId?.phone}
            </p>
          </div>

        </div>

        {/* Doctor Bio */}
        {doctor.bio && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">
              About
            </p>

            <p className="text-gray-700">
              {doctor.bio}
            </p>
          </div>
        )}

        {/* Doctor Availability */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Availability
          </p>

          {availability.length > 0 ? (
            <div className="flex flex-wrap gap-2">

              {availability.map((slot, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-lg"
                >
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </span>
              ))}

            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              No availability listed.
            </p>
          )}
        </div>

        {/* Booking Section

            Guest    -> Login button
            Patient  -> Book Appointment
            Doctor/Admin -> Nothing
        */}

        {!user ? (
          <Link
            to="/login"
            className="block w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login to Book Appointment
          </Link>
        ) : user.role === "patient" ? (
          <Link
            to={`/patient/book/${doctor._id}`}
            className="block w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Book Appointment
          </Link>
        ) : null}

      </div>
    </div>
  );
};

export default DoctorProfile;