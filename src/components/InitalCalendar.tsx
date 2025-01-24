import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export function InitialCalendar() {
  const [selected, setSelected] = React.useState<Date>();

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
      }
    />
  );
}