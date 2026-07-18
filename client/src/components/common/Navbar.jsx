import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Track scroll position to toggle navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    switch (user?.role) {
      case "patient": return "/patient/dashboard";
      case "doctor": return "/doctor/dashboard";
      case "admin": return "/admin/dashboard";
      default: return "/";
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm"
          : "bg-white backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="text-xl font-bold text-blue-600">
            MediBook
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>

            <Link to="/doctors" className="text-gray-700 hover:text-blue-600 transition-colors">
              Doctors
            </Link>

            <Link to="/specializations" className="text-gray-700 hover:text-blue-600 transition-colors">
              Specializations
            </Link>

            {user ? (
              <>
                {/* Only show for patients */}
                {user.role === "patient" && (
                  <Link
                    to="/patient/apply-doctor"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Become a Doctor
                  </Link>
                )}

                {/* Avatar + name links to dashboard */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaUserCircle className="text-lg" />
                  <span className="text-sm">Hi, {user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white transition-colors hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-2xl text-gray-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div id="mobile-menu" className="flex flex-col gap-3 pb-4 md:hidden bg-white/90 backdrop-blur-md rounded-b-xl">
            <Link to="/" onClick={closeMenu} className="py-1 px-2 text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>

            <Link to="/doctors" onClick={closeMenu} className="py-1 px-2 text-gray-700 hover:text-blue-600 transition-colors">
              Doctors
            </Link>

            <Link to="/specializations" onClick={closeMenu} className="py-1 px-2 text-gray-700 hover:text-blue-600 transition-colors">
              Specializations
            </Link>

            {user ? (
              <>
                {/* Only show for patients */}
                {user.role === "patient" && (
                  <Link
                    to="/patient/apply-doctor"
                    onClick={closeMenu}
                    className="py-1 px-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Become a Doctor
                  </Link>
                )}

                {/* Avatar + name links to dashboard */}
                <Link
                  to={getDashboardLink()}
                  onClick={closeMenu}
                  className="flex items-center gap-2 py-1 px-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaUserCircle className="text-lg" />
                  <span className="text-sm">Hi, {user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 mx-2 text-left text-sm text-white transition-colors hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="py-1 px-2 text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="inline-block w-fit rounded-lg bg-blue-600 px-4 py-2 mx-2 text-sm text-white transition-colors hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;