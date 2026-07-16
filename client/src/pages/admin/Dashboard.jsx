import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Dashboard = () => {
  // Logged-in admin information
  const { user } = useAuth();

  // Dashboard data
  const [users, setUsers] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------
  // Fetch dashboard data
  // ---------------------------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users and pending doctor applications simultaneously.
      // Promise.all() is faster than making two separate requests.
      const [usersRes, pendingRes] = await Promise.all([
        axios.get("/admin/users"),
        axios.get("/admin/doctors/pending"),
      ]);

      setUsers(usersRes.data);
      setPendingDoctors(pendingRes.data);

      setError("");
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page loads
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ---------------------------------
  // Dashboard statistics
  // ---------------------------------

  // Total registered users
  const totalUsers = users.length;

  // Number of approved doctors
  const totalDoctors = users.filter((user) => user.role === "doctor").length;

  // Doctor applications waiting for approval
  const pendingApplications = pendingDoctors.length;

  // Data used to render statistic cards
  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Doctors",
      value: totalDoctors,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Pending Applications",
      value: pendingApplications,
      color: "bg-yellow-50 text-yellow-700",
    },
  ];

  // ---------------------------------
  // Loading State
  // ---------------------------------
  if (loading) {
    return (
      <div className="px-4 py-10">
        <Spinner />
      </div>
    );
  }

  // ---------------------------------
  // Error State
  // ---------------------------------
  if (error) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ---------------------------------
  // Main Dashboard
  // ---------------------------------
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      {/* Welcome message */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.name}
      </h1>

      {/* Dashboard statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 ${stat.color}`}>
            <p className="text-3xl font-bold">{stat.value}</p>

            <p className="text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/admin/doctors"
          className="bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Review Doctor Applications
        </Link>

        <Link
          to="/admin/users"
          className="border border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Manage Users
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
