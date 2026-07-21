import { Link } from "react-router-dom";
import { FaUserMd, FaClock, FaShieldAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          About MediBook
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We're building a simpler way for patients to find and book trusted
          doctors — no phone calls, no waiting rooms full of uncertainty.
          Just a few clicks between you and the care you need.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white/90 rounded-2xl shadow-sm p-8 sm:p-10 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Our Mission
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Healthcare should be accessible, transparent, and stress-free.
          MediBook connects patients with verified doctors across a range of
          specializations, letting you browse availability, book instantly,
          and manage your appointments — all in one place.
        </p>
      </div>

      {/* Values grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: FaUserMd,
            title: "Verified Care",
            text: "Every doctor on our platform is reviewed before being listed.",
          },
          {
            icon: FaClock,
            title: "Built for Speed",
            text: "Real-time availability means less waiting, more doing.",
          },
          {
            icon: FaShieldAlt,
            title: "Privacy First",
            text: "Your health data is handled with care, always.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="text-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
              <Icon size={22} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{text}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-2xl text-center px-6 py-12">
        <h2 className="text-2xl font-bold text-white mb-3">
          Ready to get started?
        </h2>
        <p className="text-blue-100 mb-6">
          Join MediBook and take the first step toward simpler healthcare.
        </p>
        <Link
          to="/register"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default About;