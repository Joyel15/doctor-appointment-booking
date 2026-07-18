import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../api/axios.js";

export const usePendingDoctors = () => {
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
      toast.error(err.response?.data?.message || "Failed to approve doctor.");
    } finally {
      setApprovingId(null);
    }
  };

  return {
    pendingDoctors,
    loading,
    error,
    approvingId,
    fetchPendingDoctors,
    handleApprove,
  };
};