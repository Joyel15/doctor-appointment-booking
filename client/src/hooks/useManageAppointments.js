import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../api/axios.js";

export const useManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores the appointment currently being updated
  const [updatingId, setUpdatingId] = useState(null);

  // -----------------------------
  // Fetch doctor's appointments
  // -----------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/appointments/doctor");

      setAppointments(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  // Load appointments once
  useEffect(() => {
    fetchAppointments();
  }, []);

  // -----------------------------
  // Update appointment status
  // -----------------------------
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    // Prevent multiple clicks
    if (updatingId) return;

    try {
      setUpdatingId(appointmentId);

      await axios.put(`/appointments/${appointmentId}`, {
        status: newStatus,
      });

      toast.success(`Appointment ${newStatus} successfully.`);

      // Update local state instead of making another API call
      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update appointment.");
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    appointments,
    loading,
    error,
    updatingId,
    handleUpdateStatus,
  };
};