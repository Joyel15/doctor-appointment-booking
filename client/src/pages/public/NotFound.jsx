import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    // Center the content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">

      {/* Error code */}
      <h1 className="text-6xl font-bold text-blue-600">
        404
      </h1>

      {/* Main heading */}
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        Page Not Found
      </h2>

      {/* Short explanation */}
      <p className="mt-2 mb-8 text-gray-500 max-w-md">
        The page you are looking for doesn't exist, may have been moved,
        or the URL might be incorrect.
      </p>

      {/* Navigate back to home page */}
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

export default NotFound;