"use client"

import React from "react";
import "react-day-picker/style.css";
import { InitialCalendar } from "@components/InitalCalendar";
import SearchBar from "@components/SearchBar";
import EventCard from "@components/EventCard";

export default function EventsPage() {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [searchText, setSearchText] = React.useState("");
    const [availability, setAvailability] = React.useState<"open" | "closed">(
      "open");    

  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold">Events</div>
      <SearchBar
        onSearchChange={(value) => {
          setSearchText(value);
          setSelected([]);
        }}
        width="100%"
      />
      <div className="text-center">
        <div className="relative w-full h-[50vh]">
          <InitialCalendar />
          
          
          {/* <EventCard
            title="Community Cleanup"
            start={new Date("2025-02-10T09:00:00")}
            end={new Date("2025-02-10T12:00:00")}
            address="123 Main Street, Boston, MA"
            volunteers={10}
            maxVolunteers={20}
          /> */}
        </div>
      </div>

      
    </div>
  );
}
