import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../api/axios.js";
import { getSlotsForDay, getDayName } from "../utils/slotUtils.js";

const isSlotInPast = (slot, selectedDate) => {
  const today = new Date().toISOString().split("T")[0];
  if (selectedDate !== today) return false;

  const startTime = slot.split(" - ")[0];
  const [time, period] = startTime.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const slotTime = new Date();
  slotTime.setHours(hour, minute, 0, 0);

  return slotTime <= new Date();
};

const useBookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    reason: "",
  });

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/doctors/${doctorId}`);
      setDoctor(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load doctor details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (!formData.date || !doctor) return;

    const fetchBookedSlots = async () => {
      try {
        setLoadingSlots(true);
        setFormData((prev) => ({ ...prev, timeSlot: "" }));

        const dayName = getDayName(formData.date);
        const slots = getSlotsForDay(doctor.availability, dayName);
        setAvailableSlots(slots);

        if (slots.length === 0) {
          setBookedSlots([]);
          return;
        }

        const res = await axios.get(
          `/appointments/slots/${doctorId}?date=${formData.date}`
        );
        setBookedSlots(res.data.bookedSlots);
      } catch (err) {
        toast.error("Failed to load available slots.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [formData.date, doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.date || !formData.timeSlot) {
      toast.error("Please select a date and time slot.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/appointments/book", {
        doctorId,
        date: formData.date,
        timeSlot: formData.timeSlot,
        reason: formData.reason.trim(),
      });
      toast.success("Appointment booked successfully");
      navigate("/patient/appointments");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to book appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const allSlotsUnavailable =
    availableSlots.length > 0 &&
    availableSlots.every(
      (slot) =>
        bookedSlots.includes(slot) || isSlotInPast(slot, formData.date)
    );

  return {
    doctor,
    loading,
    submitting,
    error,
    availableSlots,
    bookedSlots,
    loadingSlots,
    formData,
    setFormData,
    handleSubmit,
    allSlotsUnavailable,
    isSlotInPast,
    getDayName,
  };
};

export default useBookAppointment;