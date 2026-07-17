import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";

const PendingDoctors = () => {
  // Stores all doctor applications waiting for approval
  const [pendingDoctors, setPendingDoctors] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores the id of the doctor currently being approved.
  // Used to disable only that button.
  const [approvingId, setApprovingId] = useState(null);

  // Fetch all pending doctor applications
  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/admin/doctors/pending");

      setPendingDoctors(res.data);
      setError("");
    } catch (err) {
      console.error("Pending Doctors Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load pending doctor applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data once when page opens
  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  // Approve a doctor application
  const handleApprove = async (doctorId) => {
    setApprovingId(doctorId);

    try {
      await axios.put(`/admin/doctors/${doctorId}`);

      toast.success("Doctor approved successfully.");

      // Remove approved doctor from UI immediately.
      // No need to make another API request.
      setPendingDoctors((prev) =>
        prev.filter((doctor) => doctor._id !== doctorId)
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to approve doctor."
      );
    } finally {
      setApprovingId(null);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="px-4 py-10">
        <Spinner />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={fetchPendingDoctors}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Main UI
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto">

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Pending Doctor Applications
      </h1>

      {/* Empty state */}
      {pendingDoctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-600">
          No pending doctor applications.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {pendingDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Doctor basic information */}
              <h2 className="text-lg font-semibold text-gray-900">
                {doctor.doctorId?.name}
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                {doctor.doctorId?.email}
                <br />
                {doctor.doctorId?.phone}
              </p>

              {/* Professional details */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">

                <div>
                  <p className="text-gray-500">
                    Specialization
                  </p>

                  <p className="font-medium">
                    {doctor.specialization}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Experience
                  </p>

                  <p className="font-medium">
                    {doctor.experience} years
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Consultation Fee
                  </p>

                  <p className="font-medium">
                    ₹{doctor.fees}
                  </p>
                </div>

              </div>

              {/* Approve button */}
              <button
                onClick={() => handleApprove(doctor._id)}
                disabled={approvingId === doctor._id}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {approvingId === doctor._id
                  ? "Approving..."
                  : "Approve Doctor"}
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default PendingDoctors;