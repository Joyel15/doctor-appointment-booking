import Spinner from "../../components/common/Spinner.jsx";
import useBookAppointment from "../../hooks/useBookAppointment.js";

const BookAppointment = () => {
  const {
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
  } = useBookAppointment();

  if (loading) {
    return <div className="px-4 py-10"><Spinner /></div>;
  }

  if (error) {
    return <div className="px-4 py-10 text-center text-red-500">{error}</div>;
  }

  if (!doctor) {
    return (
      <div className="px-4 py-10 text-center text-gray-600">
        Doctor not found.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Book Appointment
      </h1>

      {/* Doctor information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
          {doctor.doctorId?.name?.charAt(0) || "D"}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">
            Dr. {doctor.doctorId?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {doctor.specialization} • ₹{doctor.fees}
          </p>
        </div>
      </div>

      {/* Weekly availability reference */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Available Days
        </p>
        <div className="flex flex-wrap gap-2">
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
            (day) => {
              const isAvailable = doctor.availability?.some(
                (block) => block.day === day
              );
              return (
                <span
                  key={day}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {day.slice(0, 3)}
                </span>
              );
            }
          )}
        </div>
      </div>

      {/* Booking form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-6"
      >
        {/* Date picker */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slot picker */}
        {formData.date && (
          <div>
            <label className="block text-sm font-medium mb-3">
              Select Time Slot
            </label>

            {loadingSlots && (
              <p className="text-sm text-gray-500">Loading slots...</p>
            )}

            {/* No availability on this day */}
            {!loadingSlots && availableSlots.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
                Dr. {doctor.doctorId?.name} is not available on{" "}
                {getDayName(formData.date)}. Please select a different date.
              </div>
            )}

            {/* Slot grid */}
            {!loadingSlots && availableSlots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isPast = isSlotInPast(slot, formData.date);
                  const isDisabled = isBooked || isPast;
                  const isSelected = formData.timeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isDisabled}
                      onClick={() =>
                        !isDisabled &&
                        setFormData((prev) => ({ ...prev, timeSlot: slot }))
                      }
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium border transition
                        ${isBooked
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                          : isPast
                          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                        }
                      `}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}

            {/* All slots unavailable */}
            {!loadingSlots && allSlotsUnavailable && (
              <p className="text-sm text-red-500 mt-3">
                No available slots for this date. Please select a different date.
              </p>
            )}
          </div>
        )}

        {/* Selected slot confirmation */}
        {formData.timeSlot && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
            Selected slot: <strong>{formData.timeSlot}</strong>
          </div>
        )}

        {/* Reason */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium mb-1">
            Reason for Visit (optional)
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={4}
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            placeholder="Briefly describe your symptoms..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !formData.timeSlot}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Booking Appointment..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;