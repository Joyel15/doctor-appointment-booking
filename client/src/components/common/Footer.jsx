import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="text-lg font-bold text-blue-600">
            MediBook
          </Link>

          {/* Quick links */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/doctors" className="hover:text-blue-600 transition">
              Doctors
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {year} MediBook. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;