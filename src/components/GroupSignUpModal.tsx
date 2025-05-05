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
import useApiThrottle from "../hooks/useApiThrottle";
import { useTranslation } from "react-i18next";

const GroupSignUpModal = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const { t } = useTranslation("events");

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const buttonRef = useRef(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [reasons, setReasons] = useState("");
  const [capacity, setCapacity] = useState("");
  const [timeSlots, setTimeSlots] = React.useState([
    { start: "", end: "", submitted: false },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({
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
      alert(t("must_belong_to_org"));
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
            numVolunteers: Number(capacity),
          },
          {
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

      alert(t("group_signup_success"));
      onClose();
    } catch (err) {
      console.error("Error creating time slots:", err);
      alert(t("create_time_slots_failed"));
    }
  };

  const { fetching: submitLoading, fn: throttledHandleSubmit } = useApiThrottle(
    {
      fn: handleSubmit,
    }
  );

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
    <div className="bg-white border border-gray-300 w-[596px] h-[867px] shadow-lg rounded-xl p-6 relative gap-[14px] flex flex-col text-gray-700">
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
      <label className="text-sm font-medium flex flex-row gap-[6px] items-center">
        <Icon icon={"lets-icons:time-atack"} width="20" />
        {t("time")}
      </label>
      <div ref={calendarRef} className="flex flex-row w-full gap-[15px]">
        <TextField
          className="border border-gray-300 rounded-md px-3 py-2 w-[700px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="MM/DD/YYYY"
          variant="outlined"
          label={t("select_date")}
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
        {t("group_name")}
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
        {t("group_description")}
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
        {t("group_signup_reason")}
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
        {t("capacity")}
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
            submitLoading || isDisabled()
              ? "opacity-50 cursor-not-allowed text-white"
              : "text-white"
          }`}
          onClick={throttledHandleSubmit}
          disabled={submitLoading || isDisabled()}
        >
          {t("send")}
        </button>
      </div>
    </div>
  );
};

export default GroupSignUpModal;
