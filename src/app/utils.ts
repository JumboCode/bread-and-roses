export const compareReadableTimeSlots = (a: string, b: string) => {
  const dateA = new Date(a);
  const dateB = new Date(b);

  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
};

// Readabletimeslots are in format "Day, Month Date, Year"
export const sortedReadableTimeSlots = (sTimeSlots: string[]) => {
  return sTimeSlots.sort(compareReadableTimeSlots);
};

// StandardTimeSlots are in format "YYYYMMDD"
export const getStandardDateString = (timeSlot: Date) => {
  const date = new Date(timeSlot);
  const parts = date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  return parts[0] + parts[1] + parts[2];
};

export const getStandardDate = (dateString: string) => {
  if (dateString.length !== 8) {
    return new Date();
  }

  const month = parseInt(dateString.substring(0, 2), 10) - 1;
  const day = parseInt(dateString.substring(2, 4), 10);
  const year = parseInt(dateString.substring(4, 8), 10);

  return new Date(year, month, day);
};
