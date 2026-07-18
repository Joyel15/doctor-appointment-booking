import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import DoctorCard from "../../components/doctor/DoctorCard.jsx";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/doctors");
        if (isMounted) {
          setDoctors(res.data.slice(0, 3));
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load doctors. Please try again later.");
        }
        console.error("Failed to fetch doctors:", err.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-white/90 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find the Right Doctor, Right When You Need Them
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book appointments with trusted doctors in just a few clicks —
            simple, fast, and reliable healthcare booking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/doctors"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
            >
              Find a Doctor
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition text-center"
            >
              Register
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Not sure which specialist you need?{" "}
            <Link to="/specializations" className="text-blue-600 hover:underline">
              Browse by symptom
            </Link>
          </p>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 text-blue-600 font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Register</h3>
              <p className="text-gray-600 text-sm">
                Create your free account in under a minute.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 text-blue-600 font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Find a Doctor</h3>
              <p className="text-gray-600 text-sm">
                Browse doctors by specialization and availability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 text-blue-600 font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Book Appointment</h3>
              <p className="text-gray-600 text-sm">
                Pick a slot and confirm — that's it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED DOCTORS ================= */}
      <section className="bg-white/90 px-4 sm:px-6 lg:px-8 py-16 rounded-2xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Doctors
          </h2>

          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : doctors.length === 0 ? (
            <p className="text-center text-gray-600">
              No doctors available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}

          {/* View all doctors link */}
          {!loading && !error && doctors.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/doctors"
                className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                View All Doctors
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-2xl text-center px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to book your appointment?
          </h2>
          <p className="text-blue-100 mb-6">
            Join thousands of patients managing their healthcare with ease.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;