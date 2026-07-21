import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import DoctorCard from "../../components/doctor/DoctorCard.jsx";
import {
  FaUserMd,
  FaClock,
  FaShieldAlt,
  FaUserPlus,
  FaSearch,
  FaCalendarCheck,
} from "react-icons/fa";

const Home = () => {
  const location = useLocation();
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

  // Scroll to section if URL has a hash (e.g. /#how-it-works)
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="space-y-8">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative overflow-hidden rounded-2xl min-h-[520px] sm:min-h-[600px] flex items-center"
        style={{
          backgroundImage: "url('/images/doctor1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          {/* Eyebrow badge */}
          <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            Trusted by patients across the country
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
            Find the Right Doctor,
            <br className="hidden sm:block" />
            Right When You Need Them
          </h1>

          <p className="text-base sm:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book appointments with trusted doctors in just a few clicks —
            simple, fast, and reliable healthcare booking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/doctors"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-900/30 text-center"
            >
              Find a Doctor
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto bg-white/95 text-blue-600 px-8 py-3.5 rounded-lg font-semibold hover:bg-white transition text-center"
            >
              Register
            </Link>
          </div>

          <p className="text-sm text-gray-300">
            Not sure which specialist you need?{" "}
            <Link
              to="/specializations"
              className="text-white font-semibold hover:underline"
            >
              Browse by symptom
            </Link>
          </p>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {[
              {
                icon: FaUserPlus,
                step: "1",
                title: "Register",
                text: "Create your free account in under a minute.",
              },
              {
                icon: FaSearch,
                step: "2",
                title: "Find a Doctor",
                text: "Browse doctors by specialization and availability.",
              },
              {
                icon: FaCalendarCheck,
                step: "3",
                title: "Book Appointment",
                text: "Pick a slot and confirm — that's it.",
              },
            ].map(({ icon: Icon, step, title, text }) => (
              <div
                key={step}
                className="relative text-center bg-white/80 rounded-2xl p-6"
              >
                <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white mx-auto mb-4 shadow-md">
                  <Icon size={22} />
                  <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-white text-blue-600 text-xs font-bold border-2 border-blue-600">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section
        id="why-choose-us"
        className="bg-blue-50/80 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 rounded-2xl"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: FaUserMd,
                title: "Verified Doctors",
                text: "Every doctor on our platform is reviewed and approved before being listed.",
              },
              {
                icon: FaClock,
                title: "Instant Booking",
                text: "See real-time availability and confirm your appointment in seconds.",
              },
              {
                icon: FaShieldAlt,
                title: "Secure & Private",
                text: "Your health information stays protected with us, always.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED DOCTORS ================= */}
      <section
        id="featured-doctors"
        className="bg-white/80 px-4 sm:px-6 lg:px-8 py-16 rounded-2xl"
      >
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
        <div className="max-w-4xl mx-auto bg-[#2563EB] rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center">
            {/* Text side */}
            <div className="flex-1 text-center sm:text-left px-6 py-12 sm:px-10">
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

            {/* Image side */}
            <div className="flex-1 hidden sm:flex items-center justify-center p-8">
              <img
                src="/images/cta-illustration.png"
                alt="Book an appointment"
                className="w-full max-w-[280px] h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;