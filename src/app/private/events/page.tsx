"use client"

import React from "react";
import "react-day-picker/style.css";
import { InitialCalendar } from "@components/InitalCalendar";
import SearchBar from "@components/SearchBar";
// import { EventCard } from "@components/EventCard";

export default function EventsPage() {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [searchText, setSearchText] = React.useState("");

  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold">Events</div>
      <SearchBar
        onSearchChange={(value) => {
          setSearchText(value);
          setSelected([]);
        }}
      />
      <div className="text-center">
        <div className="relative w-full h-[50vh]">
          <InitialCalendar />
          {/* <EventCard /> */}
        </div>
      </div>
    </div>
  );
}
