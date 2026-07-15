import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";

const Doctors = () => {
  // Store all approved doctors fetched from the backend
  const [doctors, setDoctors] = useState([]);

  // Search text entered by the user
  const [search, setSearch] = useState("");

  // Loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Error message if API request fails
  const [error, setError] = useState("");

  // Fetch doctors only once when the page loads
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Request approved doctors from backend
        const res = await axios.get("/doctors");

        // Store doctors in state
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);

        setError("Failed to load doctors. Please try again later.");
      } finally {
        // Stop loading whether request succeeds or fails
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Normalize search text once
  const searchQuery = search.trim().toLowerCase();

  // Filter doctors based on name or specialization
  const filteredDoctors = doctors
    .filter((doctor) => {
      const doctorName = doctor.doctorId?.name?.toLowerCase() || "";
      const specialization =
        doctor.specialization?.toLowerCase() || "";

      return (
        doctorName.includes(searchQuery) ||
        specialization.includes(searchQuery)
      );
    })
    // Sort alphabetically by doctor's name
    .sort((a, b) =>
      (a.doctorId?.name || "").localeCompare(b.doctorId?.name || "")
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
        Find a Doctor
      </h1>

      {/* Search input */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && <Spinner />}

      {/* API Error */}
      {!loading && error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* No matching doctors */}
      {!loading && !error && filteredDoctors.length === 0 && (
        <p className="text-center text-gray-600">
          No doctors found matching your search.
        </p>
      )}

      {/* Display doctors */}
      {!loading && !error && filteredDoctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Link
              key={doctor._id}
              to={`/doctors/${doctor._id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center"
            >
              {/* Placeholder avatar using first letter of doctor's name */}
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
                ₹{doctor.fees} • {doctor.experience} years experience
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;