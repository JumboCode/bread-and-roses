"use client";

import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface CalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  previousDisabled: boolean;
  onDateChange?: () => void;
}

export function Calendar({
  selectedDate,
  setSelectedDate,
  previousDisabled,
  onDateChange,
}: CalendarProps) {
  const customDays = ["s", "m", "t", "w", "t", "f", "s"];

  return (
    <div className="border-2 rounded-[20px] size-fit py-4 px-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (!date) return;
          if (selectedDate?.toDateString() !== date.toDateString()) {
            setSelectedDate(date);
            if (onDateChange) onDateChange();
          }
        }}
        showOutsideDays
        disabled={(date) => {
          if (previousDisabled) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const cutoff = new Date(tomorrow.getTime() - 24 * 60 * 60 * 1000);
            return date < cutoff;
          } else {
            return false;
          }
        }}
        formatters={{
          formatWeekdayName: (weekday) => customDays[weekday.getDay()],
          formatCaption: (month) =>
            month.toLocaleDateString("en-US", { month: "long" }),
        }}
        classNames={{
          selected: "bg-teal-500 border-teal-500 text-white rounded-full",
          month: "font-size-sm text-gray-800",
          button_previous:
            "bg-white border border-gray-300 rounded-lg [&>svg]:fill-teal-600",
          button_next:
            "bg-teal-600 border-2 border-teal-600 rounded-lg [&>svg]:fill-white ml-2",
          today: "text-teal-500",
          outside: "text-gray-400",
        }}
      />
    </div>
  );
}
