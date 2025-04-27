"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputAdornment } from "@mui/material";
import { Calendar } from "@components/Calendar";
import "react-day-picker/style.css";
import TimeSlotFields from "./TimeSlotFields";
import { useSession } from "next-auth/react";
import { addTimeSlot } from "@api/timeSlot/route.client";
import { TimeSlotStatus } from "@prisma/client";

const GroupSignUpModal = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const buttonRef = useRef(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [reasons, setReasons] = useState("");
  const [capacity, setCapacity] = useState("");
  const [timeSlots, setTimeSlots] = React.useState([
    { start: "", end: "", submitted: false },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    title: false,
    groupName: false,
    description: false,
    reasons: false,
    capacity: false,
    date: false,
    timeSlot: false,
  });

  const hasErrors = () => {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const timeSlotHasError = timeSlots.some((slot, index) => {
      if (!slot.start || !slot.end) return true;
      if (slot.start >= slot.end) return true;

      const newStart = toMinutes(slot.start);
      const newEnd = toMinutes(slot.end);

      return timeSlots.some((s, i) => {
        if (i === index || !s.submitted) return false;
        const sStart = toMinutes(s.start);
        const sEnd = toMinutes(s.end);
        return newStart < sEnd && newEnd > sStart;
      });
    });

    const newErrors = {
      title: title.trim() === "",
      groupName: groupName.trim() === "",
      description: description.trim() === "",
      reasons: reasons.trim() === "",
      capacity: capacity.trim() === "" || isNaN(Number(capacity)),
      date: !selectedDate,
      timeSlot: timeSlotHasError,
    };

    setErrors(newErrors);
    return Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (hasErrors()) return;

    if (!session?.user || !session.user.organizationId) {
      alert("You must belong to an organization to create time slots.");
      return;
    }

    try {
      const slotsToSubmit = timeSlots.filter((slot) => slot.start && slot.end);

      for (const slot of slotsToSubmit) {
        const start = new Date(
          `${format(selectedDate!, "yyyy-MM-dd")}T${slot.start}`
        );
        const end = new Date(
          `${format(selectedDate!, "yyyy-MM-dd")}T${slot.end}`
        );
        const durationHours =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        await addTimeSlot(
          {
            userId: session.user.id,
            organizationId: session.user.organizationId,
            startTime: start,
            endTime: end,
            durationHours,
            date: selectedDate!,
            approved: false,
            status: TimeSlotStatus.AVAILABLE,
          },
          {
            eventTitle: title,
            date: format(selectedDate!, "yyyy-MM-dd"),
            startTime: slot.start,
            endTime: slot.end,
            groupName,
            groupDescription: description,
            groupReason: reasons,
            groupCapacity: Number(capacity),
          }
        );
      }

      alert(
        "Successfully created group request! Please wait for the admins to approve your request."
      );
      onClose();
    } catch (err) {
      console.error("Error creating time slots:", err);
      alert("Failed to create time slots. Please try again.");
    }
  };

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

  const isDisabled = () => {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const timeSlotHasError = timeSlots.some((slot, index) => {
      if (!slot.start || !slot.end) return true;
      if (slot.start >= slot.end) return true;

      const newStart = toMinutes(slot.start);
      const newEnd = toMinutes(slot.end);

      return timeSlots.some((s, i) => {
        if (i === index || !s.submitted) return false;
        const sStart = toMinutes(s.start);
        const sEnd = toMinutes(s.end);
        return newStart < sEnd && newEnd > sStart;
      });
    });

    return (
      title.trim() === "" ||
      groupName.trim() === "" ||
      description.trim() === "" ||
      reasons.trim() === "" ||
      capacity.trim() === "" ||
      isNaN(Number(capacity)) ||
      !selectedDate ||
      timeSlotHasError
    );
  };

  return (
    <div className="bg-white border border-gray-300 w-[596px] h-[867px] shadow-md rounded-xl p-6 relative gap-[14px] flex flex-col text-gray-700">
      {/* Header */}
      <div className="flex items-center justify-end">
        {/* Close Button (optional) */}
        <button
          className="text-[#101828] hover:text-gray-700 rounded-full"
          onClick={onClose}
        >
          <Icon icon={"icon-park-solid:close-one"} width="25" />
        </button>
      </div>
      <TextField
        placeholder="Add event title"
        variant="standard"
        fullWidth
        autoComplete="off"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={submitted && errors.title}
        slotProps={{
          input: {
            sx: {
              fontSize: 18,
              fontWeight: 600,
              color: "#6B7280",
              padding: 0,
            },
          },
          root: {
            sx: {
              "&::before": {
                borderBottom: "1px solid #D0D5DD",
              },
            },
          },
        }}
      />

      <label className="text-sm font-medium flex flex-row gap-[6px] items-center">
        <Icon icon={"lets-icons:time-atack"} width="20" />
        Time
      </label>
      <div ref={calendarRef} className="flex flex-row w-full gap-[15px]">
        <TextField
          className="border border-gray-300 rounded-md px-3 py-2 w-[700px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="MM/DD/YYYY"
          variant="outlined"
          label="Select Date"
          autoComplete="off"
          size="small"
          onFocus={() => setShowCalendar(!showCalendar)}
          value={selectedDate ? format(selectedDate, "MM/dd/yyyy") : ""}
          error={submitted && errors.date}
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
              top: "calc(100% - 670px)",
              left: "20px",
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
        <TimeSlotFields timeSlots={timeSlots} setTimeSlots={setTimeSlots} />
      </div>

      <label className="text-sm font-medium flex flex-row gap-[6px] items-center">
        <Icon icon={"material-symbols:group"} width="20" />
        Name of group
      </label>
      <TextField
        variant="outlined"
        size="small"
        autoComplete="off"
        fullWidth
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        error={submitted && errors.groupName}
      />

      <label className="text-sm font-medium flex flex-row gap-[6px] items-center">
        <Icon icon={"basil:document-solid"} width="20" />
        Group description
      </label>
      <TextField
        variant="outlined"
        size="small"
        autoComplete="off"
        fullWidth
        multiline
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={submitted && errors.description}
      />

      <label className="text-sm font-medium flex flex-row gap-[6px] items-center">
        <Icon icon={"material-symbols:group-add"} width="20" />
        Reason(s) for group signup
      </label>
      <TextField
        variant="outlined"
        size="small"
        autoComplete="off"
        fullWidth
        multiline
        rows={6}
        value={reasons}
        onChange={(e) => setReasons(e.target.value)}
        error={submitted && errors.reasons}
      />

      <label className="text-sm font-medium flex flex-row gap-[6px] items-center">
        <Icon icon={"material-symbols:groups"} width="20" />
        Capacity
      </label>
      <TextField
        className="w-[46px]"
        variant="outlined"
        size="small"
        autoComplete="off"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        error={submitted && errors.capacity}
      />

      <div className="flex flex-row justify-end mt-4">
        <button
          className={`bg-teal-600 text-[14px] w-[67px] h-[40px] py-[10px] px-[16px] rounded-lg font-semibold flex justify-center items-center ${
            isDisabled()
              ? "opacity-50 cursor-not-allowed text-white"
              : "text-white"
          }`}
          onClick={handleSubmit}
          disabled={isDisabled()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupSignUpModal;
