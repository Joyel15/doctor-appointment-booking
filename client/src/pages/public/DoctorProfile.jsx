import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const DoctorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, reviewsRes] = await Promise.all([
          axios.get(`/doctors/${id}`),
          axios.get(`/reviews/doctor/${id}`),
        ]);

        setDoctor(doctorRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError("Failed to load doctor profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="px-4 py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-center text-red-500">{error}</div>
    );
  }

  if (!doctor) {
    return (
      <div className="px-4 py-10 text-center text-gray-600">
        Doctor not found.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0">
            {doctor.doctorId?.name?.charAt(0) || "D"}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dr. {doctor.doctorId?.name}
            </h1>
            <p className="text-gray-500">{doctor.specialization}</p>
            {averageRating && (
              <p className="text-sm text-yellow-500 mt-1">
                {"★".repeat(Math.round(averageRating))}
                {"☆".repeat(5 - Math.round(averageRating))}{" "}
                <span className="text-gray-500">
                  {averageRating} ({reviews.length} review
                  {reviews.length !== 1 ? "s" : ""})
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-medium text-gray-900">
              {doctor.experience} years
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Consultation Fees</p>
            <p className="font-medium text-gray-900">₹{doctor.fees}</p>
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

        {/* Bio */}
        {doctor.bio && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">About</p>
            <p className="text-gray-700">{doctor.bio}</p>
          </div>
        )}

        {/* Availability */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Availability</p>
          {doctor.availability && doctor.availability.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {doctor.availability.map((slot, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-lg"
                >
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No availability listed.</p>
          )}
        </div>

        {/* Book Appointment button */}
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

      {/* Reviews section */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Patient Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-600 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">
                    {review.patientId?.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-yellow-500 text-sm mb-2">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
                {review.comment && (
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;