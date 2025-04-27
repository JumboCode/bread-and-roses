import React, { useEffect, useRef, useState } from "react";
import clear_circle from "../app/icons/clear-circle.svg";
import Image from "next/image";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TimeSlotFields from "./TimeSlotFields";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { InputAdornment, TextField } from "@mui/material";
import { Calendar } from "./Calendar";
import { format } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";
import { addCustomDay, getCustomDay } from "@api/customDay/route.client";
import useApiThrottle from "../hooks/useApiThrottle";

interface CustomizeEventProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const CustomizeEventModal = (props: CustomizeEventProps) => {
  const { modalVisible, setModalVisible } = props;

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeSlots, setTimeSlots] = React.useState([
    { start: "10:00", end: "18:00", submitted: false },
  ]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasTimeSlotError, setHasTimeSlotError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModalVisible(false);
      }
    };

    if (modalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalVisible, setModalVisible]);

  useEffect(() => {
    const hasError = timeSlots.some((slot, index) => {
      if (!slot.start || !slot.end) return true;
      if (slot.start >= slot.end) return true;

      const toMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
      };

      const newStart = toMinutes(slot.start);
      const newEnd = toMinutes(slot.end);

      return timeSlots.some((s, i) => {
        if (i === index || !s.submitted) return false;
        const sStart = toMinutes(s.start);
        const sEnd = toMinutes(s.end);
        return newStart < sEnd && newEnd > sStart;
      });
    });

    setHasTimeSlotError(hasError);
  }, [timeSlots]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // if user clicks outside the calendar, close it
      if (
        calendarRef.current &&
        event.target instanceof Node &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    }

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
    const fetchCustomDay = async () => {
      if (!selectedDate) return;

      try {
        const result = await getCustomDay(selectedDate);
        const customDay = result.data;

        if (customDay) {
          const start = new Date(customDay.startTime)
            .toTimeString()
            .slice(0, 5);
          const end = new Date(customDay.endTime).toTimeString().slice(0, 5);
          setTimeSlots([{ start, end, submitted: false }]);
          setTitle(customDay.title ?? "");
          setDescription(customDay.description ?? "");
        } else {
          setTimeSlots([{ start: "10:00", end: "18:00", submitted: false }]);
          setTitle("");
          setDescription("");
        }
      } catch (error) {
        console.error("Error fetching CustomDay:", error);
        setTimeSlots([{ start: "10:00", end: "18:00", submitted: false }]);
        setTitle("");
        setDescription("");
      }
    };

    if (modalVisible) {
      fetchCustomDay();
    }
  }, [modalVisible, selectedDate]);

  const handleAdd = async () => {
    if (!selectedDate || !timeSlots[0]?.start || !timeSlots[0]?.end) return;

    const customDay = {
      date: selectedDate,
      startTime: new Date(
        `${format(selectedDate, "yyyy-MM-dd")}T${timeSlots[0].start}`
      ),
      endTime: new Date(
        `${format(selectedDate, "yyyy-MM-dd")}T${timeSlots[0].end}`
      ),
      title,
      description,
    };

    try {
      const result = await addCustomDay(customDay);

      if (result.code === "SUCCESS") {
        setModalVisible(false);
        alert("Event saved successfully!");
      } else {
        alert("Failed to save event.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    }
  };

  const { fetching: addLoading, fn: throttledHandleAdd } = useApiThrottle({
    fn: handleAdd,
  });

  if (!modalVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-20">
      <div
        ref={modalRef}
        className="bg-white rounded-[12px] border w-[596px] h-[503.03px] pt-8 pr-5 pb-8 pl-5 relative space-y-4 shadow-lg"
      >
        <div className="flex justify-end">
          <Image
            className="cursor-pointer"
            src={clear_circle}
            width={29}
            height={29}
            alt="clear"
            onClick={() => setModalVisible(false)}
          />
        </div>
        <TextField
          placeholder="Add event title"
          variant="standard"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{
            style: {
              color: "#000000",
              fontWeight: 600,
            },
            disableUnderline: true,
          }}
          sx={{
            "& input::placeholder": {
              color: "#98A2B3",
              opacity: 1,
              textTransform: "capitalize",
            },
          }}
        />
        <hr
          className="border-t border-gray-300 m-0 p-0"
          style={{ margin: 0 }}
        />
        <div className="flex items-center space-x-2 mb-2">
          <TimelapseIcon />
          <span className="font-sm">Time</span>
        </div>
        <div className="mb-4">
          <div className="flex gap-4">
            <div ref={calendarRef} className="flex items-center gap-4">
              <TextField
                className="border border-gray-300 rounded-md px-3 py-2 w-[215.5px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="MM/DD/YYYY"
                variant="outlined"
                label="Start Date"
                autoComplete="off"
                size="small"
                onFocus={() => setShowCalendar(!showCalendar)}
                value={selectedDate ? format(selectedDate, "MM/dd/yyyy") : ""}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <button
                          ref={buttonRef}
                          onClick={() => setShowCalendar(!showCalendar)}
                        >
                          <Icon icon={"mdi:calendar"} width="25" />
                        </button>
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              {showCalendar && (
                <div
                  style={{
                    position: "absolute",
                    top: "205px",
                    zIndex: 10,
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Calendar
                    selectedDate={selectedDate ?? undefined}
                    setSelectedDate={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }
                    }}
                    previousDisabled
                  />
                </div>
              )}
              <TimeSlotFields
                timeSlots={timeSlots}
                setTimeSlots={setTimeSlots}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <DescriptionRoundedIcon />
            <span className="font-sm">Event description (if any)</span>
          </div>
          <textarea
            className="w-full border rounded px-3 py-2"
            style={{
              width: "556px",
              height: "172px",
              borderRadius: "8px",
              paddingRight: "12px",
              paddingLeft: "12px",
              borderWidth: "1px",
              resize: "none",
            }}
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className={`px-4 py-2 rounded bg-teal-600 text-white ${
              addLoading || hasTimeSlotError
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-teal-700"
            }`}
            onClick={throttledHandleAdd}
            disabled={addLoading || hasTimeSlotError}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeEventModal;
