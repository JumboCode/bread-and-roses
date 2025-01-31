"use client";

import React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";

export function InitialCalendar() {
  const [selected, setSelected] = React.useState<Date>();
  const customDays = ['m', 't', 'w', 't', 'f', 's', 's'];
  const defaultClassNames = getDefaultClassNames();

  return (
    <div className="border-2 rounded-md w-80 size-fit py-4 px-2">
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      showOutsideDays
      formatters={{
        formatWeekdayName: (weekday) => customDays[weekday.getDay()],
        formatCaption: (month) => month.toLocaleDateString('en-US', {month: 'long'}), // displays only the month
        // formatDay: (day) => day.getDay().toString().padStart(2, '0'),
      }}
      classNames={{
        //is the figma showing date selected or day that it is ? 
        selected: 'bg-teal-500 border-teal-500 text-white rounded-full',
        month: 'font-size-sm text-gray-800',
        //how to change color of icon inside buttons? 
        button_previous:'bg-white border-2 border-gray-400 rounded-md [&>svg]:fill-teal-700',
        button_next: 'bg-teal-700 border-2 border-teal-700 rounded-md [&>svg]:fill-white ml-2',
        // chevron: 'fill-white',
        today: 'text-teal-500',
        outside: 'text-gray-400',
      }}
    />
    </div>
  );
} 