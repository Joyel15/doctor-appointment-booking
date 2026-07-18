import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../api/axios.js";

const useMyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
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

  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmCancel) return;

    try {
      setCancellingId(appointmentId);
      await axios.put(`/appointments/${appointmentId}`, {
        status: "cancelled",
      });
      toast.success("Appointment cancelled successfully.");
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel appointment."
      );
    } finally {
      setCancellingId(null);
    }
  };

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

  return {
    appointments,
    loading,
    error,
    cancellingId,
    reviewModal,
    setReviewModal,
    reviewData,
    setReviewData,
    submittingReview,
    handleCancel,
    handleSubmitReview,
  };
};

export default useMyAppointments;