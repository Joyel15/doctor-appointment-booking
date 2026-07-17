import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import DoctorCard from "../../components/doctor/DoctorCard.jsx";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const searchQuery = search.trim().toLowerCase();

  const filteredDoctors = doctors
    .filter((doctor) => {
      const doctorName = doctor.doctorId?.name?.toLowerCase() || "";
      const specialization = doctor.specialization?.toLowerCase() || "";
      return (
        doctorName.includes(searchQuery) ||
        specialization.includes(searchQuery)
      );
    })
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

      {/* Display doctors using DoctorCard component */}
      {!loading && !error && filteredDoctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;