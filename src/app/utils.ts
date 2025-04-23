import { TimeSlot } from "@prisma/client";
import { time } from "console";

export const compareStandardTimeSlots = (a: string, b: string) => {
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

// StandardTimeSlots are in format "Day, Month Date, Year"
export const sortedStandardTimeSlots = (sTimeSlots: string[]) => {
  return sTimeSlots.sort(compareStandardTimeSlots);
};
