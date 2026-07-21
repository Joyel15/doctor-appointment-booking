import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="text-lg font-bold text-blue-600">
              MediBook
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              Book trusted doctors, hassle-free.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Explore</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link to="/doctors" className="hover:text-blue-600 transition">
                Find Doctors
              </Link>
              <Link to="/specializations" className="hover:text-blue-600 transition">
                Specializations
              </Link>
              <Link to="/#featured-doctors" className="hover:text-blue-600 transition">
                Featured Doctors
              </Link>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">About</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link to="/#how-it-works" className="hover:text-blue-600 transition">
                How It Works
              </Link>
              <Link to="/#why-choose-us" className="hover:text-blue-600 transition">
                Why Choose Us
              </Link>
              <Link to="/about" className="hover:text-blue-600 transition">
                About Us
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Support</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link to="/contact" className="hover:text-blue-600 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          &copy; {year} MediBook. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;