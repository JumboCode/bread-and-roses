"use client";

import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputAdornment } from "@mui/material";
import { Calendar } from "@components/Calendar";
import "react-day-picker/style.css";

const GroupSignUpModal = ({ onClose }: { onClose: () => void }) => {
  const [showModal, setShowModal] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const buttonRef = useRef(null);
  const calendarRef = useRef(null);

  // separate useStates for each field (for backend)
  const [title, setTitle] = useState("");
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [reasons, setReasons] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [errors, setErrors] = useState({
    title: false,
    groupName: false,
    description: false,
    reasons: false,
    capacity: false,
    date: false,
    startTime: false,
    endTime: false,
  });

  // form submission logic
  const handleSubmit = () => {
    // error when some fields aren't filled out
    const newErrors = {
      title: title.trim() === "",
      groupName: groupName.trim() === "",
      description: description.trim() === "",
      reasons: reasons.trim() === "",
      capacity: capacity.trim() === "" || isNaN(Number(capacity)),
      date: date.trim() === "",
      startTime: startTime.trim() === "",
      endTime: endTime.trim() === "",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;
    onClose();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // if user clicks outside the calendar, close it
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
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

  if (!showModal) return null;

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
        error={errors.title}
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

      <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
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
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
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
            <Calendar />
          </div>
        )}
        <TextField
          label="Start time"
          variant="outlined"
          autoComplete="off"
          size="small"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          error={errors.startTime}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          label="End time"
          variant="outlined"
          autoComplete="off"
          size="small"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          error={errors.endTime}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </div>

      <label className="block text-sm font-medium  flex flex-row gap-[6px] items-center">
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
        error={errors.groupName}
      />

      <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
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
        error={errors.description}
      />

      <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
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
        error={errors.reasons}
      />

      <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
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
        error={errors.capacity}
      />

      <div className="flex flex-row justify-end mt-4">
        <button
          className="bg-teal-600 text-[14px] w-[67px] h-[40px] py-[10px] px-[16px] text-white rounded-lg font-semibold flex justify-center items-center"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupSignUpModal;
