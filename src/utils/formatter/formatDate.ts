export function formatDate(dateString: string): string {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  const dateOfMoth = date.getDate();

  // Get the day of the week (0-6, where 0 is Sunday)
  const dayOfWeek = date.getDay();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the month name (0-11, where 0 is January)
  const month = date.getMonth();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the year
  const year = date.getFullYear();

  // Format the date string
  const formattedDate = `${dayNames[dayOfWeek]}, ${dateOfMoth} ${monthNames[month]} ${year}`;

  return formattedDate;
}

export function formatDateFormData(isoDateString: string): string {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed

  return `${year}-${month}-${day}`;
}
