import { FaEnvelope, FaMapMarkerAlt} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
          Have a question, feedback, or need help with your account? We'd
          love to hear from you.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white/90 rounded-xl shadow-sm p-6 text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
            <FaEnvelope size={18} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
          <a
            href="mailto:example@12.com"
            className="text-sm text-blue-600 hover:underline"
          >
            support@example.com
          </a>
        </div>

        <div className="bg-white/90 rounded-xl shadow-sm p-6 text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
            <FaMapMarkerAlt size={18} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
          <p className="text-sm text-gray-600">Kerala, India</p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50/80 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600">
          For urgent medical concerns, please contact your doctor directly or
          visit the nearest emergency room. MediBook is a booking platform
          and does not provide medical advice.
        </p>
      </div>
    </div>
)};

export default Contact;