import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

// Shared layout used across pages
// Includes a navbar, main content area, and footer
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">

      {/* Top navigation bar */}
      <Navbar />

      {/* Main page content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer displayed on every page */}
      <Footer />

    </div>
  );
};

export default Layout;