import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import axios from "../api/axios.js";

const usePatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/appointments/patient");
      setAppointments(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmitReview = async () => {
    try {
      setSubmittingReview(true);
      await axios.post("/reviews", {
        appointmentId: reviewModal._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      toast.success("Review submitted successfully!");
      setReviewModal(null);
      setReviewData({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const completed = appointments.filter((a) => a.status === "completed").length;

    return [
      { label: "Total Appointments", value: total, color: "bg-blue-50 text-blue-700" },
      { label: "Pending", value: pending, color: "bg-yellow-50 text-yellow-700" },
      { label: "Confirmed", value: confirmed, color: "bg-green-50 text-green-700" },
      { label: "Completed", value: completed, color: "bg-purple-50 text-purple-700" },
    ];
  }, [appointments]);

  const recentAppointments = appointments.slice(0, 5);

  return {
    appointments,
    loading,
    error,
    reviewModal,
    setReviewModal,
    reviewData,
    setReviewData,
    submittingReview,
    handleSubmitReview,
    stats,
    recentAppointments,
  };
};

export default usePatientDashboard;