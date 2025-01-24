import React from "react";
import "react-day-picker/style.css";
import { InitialCalendar } from "@components/InitalCalendar";

export default function EventsPage() {

  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold">Events</div>
      <div className="text-center">
        <div className="relative w-full h-[50vh]">
          <InitialCalendar />
        </div>
        <div className="text-[#344054] font-['Kepler_Std'] text-3xl font-semibold mt-8">
          Coming Soon!
        </div>
      </div>
    </div>
  );
}
