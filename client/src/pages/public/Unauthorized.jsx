import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    // Center the content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">

      {/* HTTP status code */}
      <h1 className="text-6xl font-bold text-red-500">
        403
      </h1>

      {/* Page heading */}
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        Access Denied
      </h2>

      {/* Explanation */}
      <p className="mt-2 mb-8 max-w-md text-gray-500">
        You don't have permission to access this page.
        Please log in with an authorized account or return to the home page.
      </p>

      {/* Navigate back to home */}
      <Link
        to="/"
        replace
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>

    </div>
  );
};

export default Unauthorized;