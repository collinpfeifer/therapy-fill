import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function formatDateTime(dateTime: string) {
  const now = dayjs();
  const date = dayjs(dateTime);

  // Check if the time is today or tomorrow
  if (date.isSame(now, "day")) {
    return `Today at ${date.format("h:mma")}`; // Format: "Today at 3:00pm"
  } else if (date.isSame(now.add(1, "day"), "day")) {
    return `Tomorrow at ${date.format("h:mma")}`; // Format: "Tomorrow at 3:00pm"
  } else {
    return date.format("MMMM D, YYYY [at] h:mma"); // Format: "January 10, 2025 at 3:00pm"
  }
}

export function formatAppointmentTime(dateTime: string) {
  const date = dayjs(dateTime);
  // Get the full date (e.g., "January 9, 2025")
  const fullDate = date.format("MMMM D, YYYY");

  // Get the time (e.g., "10:30 AM")
  const time = date.format("h:mm A");

  // Get the time one hour later (e.g., "11:30 AM")
  const oneHourLater = date.add(1, "hour").format("h:mm A");

  return `${fullDate} - ${time} - ${oneHourLater}`;
}

export const getTimeUntilStart = (date: Date) => {
  const now = dayjs();
  const appointmentTime = dayjs(date);
  return appointmentTime.from(now, true);
};
