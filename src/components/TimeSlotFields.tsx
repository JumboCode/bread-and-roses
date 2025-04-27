import { TextField } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface TimeSlotProps {
  timeSlots: { start: string; end: string; submitted: boolean }[];
  setTimeSlots: React.Dispatch<
    React.SetStateAction<{ start: string; end: string; submitted: boolean }[]>
  >;
}

const TimeSlotFields = (props: TimeSlotProps) => {
  const { timeSlots, setTimeSlots } = props;

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const doesOverlap = (newStart: string, newEnd: string, index: number) => {
    const newStartMinutes = toMinutes(newStart);
    const newEndMinutes = toMinutes(newEnd);

    return timeSlots.some((slot, i) => {
      if (i === index || !slot.submitted) return false;

      const start = toMinutes(slot.start);
      const end = toMinutes(slot.end);

      return newStartMinutes < end && newEndMinutes > start;
    });
  };

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  return (
    <div>
      <div className="flex flex-col gap-4 flex-grow">
        {timeSlots.map((slot, index) => (
          <div key={index}>
            {slot.submitted ? (
              <div className="border border-[#D0D5DD] rounded-lg flex p-2 justify-between">
                <div className="flex gap-4">
                  <Icon
                    icon="material-symbols:calendar-today"
                    className="text-[#344054]"
                    width="20"
                    height="20"
                  />
                  <div>
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </div>
                </div>
                <Icon
                  icon="ic:baseline-clear"
                  className="text-[#344054] cursor-pointer"
                  width="20"
                  height="20"
                  onClick={() => {
                    const newSlots = [...timeSlots];
                    newSlots.splice(index, 1);
                    setTimeSlots(newSlots);
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <TextField
                  type="time"
                  variant="outlined"
                  size="small"
                  label="Start Time"
                  value={slot.start}
                  onChange={(e) => {
                    const newSlots = [...timeSlots];
                    newSlots[index].start = e.target.value;
                    setTimeSlots(newSlots);
                  }}
                  error={Boolean(
                    (slot.start && slot.end && slot.start > slot.end) ||
                      (slot.start &&
                        slot.end &&
                        doesOverlap(slot.start, slot.end, index))
                  )}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      max: slot.end || "23:59",
                    },
                  }}
                />
                <TextField
                  type="time"
                  variant="outlined"
                  size="small"
                  label="End Time"
                  value={slot.end}
                  onChange={(e) => {
                    const newSlots = [...timeSlots];
                    newSlots[index].end = e.target.value;
                    setTimeSlots(newSlots);
                  }}
                  error={Boolean(
                    (slot.start && slot.end && slot.end < slot.start) ||
                      (slot.start &&
                        slot.end &&
                        doesOverlap(slot.start, slot.end, index))
                  )}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      min: slot.start || "00:00",
                    },
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotFields;
