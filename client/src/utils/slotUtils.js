// Convert 24hr time string to 12hr format
// "09:00" → "09:00 AM"
// "13:30" → "01:30 PM"
const to12Hr = (time24) => {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr);
  const minute = minuteStr;
  const period = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  const paddedHour = hour.toString().padStart(2, "0");
  return `${paddedHour}:${minute} ${period}`;
};

// Generate 30 min slots between startTime and endTime
// startTime and endTime in "HH:MM" 24hr format
export const generateSlots = (startTime, endTime) => {
  const slots = [];

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    // Calculate slot end time
    let nextMin = currentMin + 30;
    let nextHour = currentHour;

    if (nextMin >= 60) {
      nextMin -= 60;
      nextHour += 1;
    }

    // Only add slot if it fits within the block
    if (
      nextHour < endHour ||
      (nextHour === endHour && nextMin <= endMin)
    ) {
      const slotStart = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
      const slotEnd = `${String(nextHour).padStart(2, "0")}:${String(nextMin).padStart(2, "0")}`;

      slots.push(`${to12Hr(slotStart)} - ${to12Hr(slotEnd)}`);
    }

    currentHour = nextHour;
    currentMin = nextMin;
  }

  return slots;
};

// Generate all slots for a given day from doctor availability
// Handles multiple blocks per day
export const getSlotsForDay = (availability, dayName) => {
  // Find all blocks for this day
  const dayBlocks = availability.filter(
    (block) => block.day.toLowerCase() === dayName.toLowerCase()
  );

  if (dayBlocks.length === 0) return [];

  // Generate slots for each block and combine
  const allSlots = dayBlocks.flatMap((block) =>
    generateSlots(block.startTime, block.endTime)
  );

  return allSlots;
};

// Get day name from a date string
// "2026-08-03" → "Monday"
export const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
};