"use client"

import React, { useState } from "react";
import "react-day-picker/style.css";
import { InitialCalendar } from "@components/InitalCalendar";
import SearchBar from "@components/SearchBar";
import EventCard from "@components/EventCard";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function EventsPage() {
    const [selected, setSelected] = useState<string[]>([]);
    const [searchText, setSearchText] = useState("");
    const [availability, setAvailability] = useState<"open" | "closed">("open");    

  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold flex flex-row items-center gap-x-[12px]">
        <Icon icon="uil:calender" width="44" height="44" />
        Events
      </div>
      <div className="my-[32px]">
        <SearchBar
          onSearchChange={(value) => {
            setSearchText(value);
            setSelected([]);
          }}
          width="100%"
        />
      </div>
        <div className="relative text-center w-full h-[50vh] flex flex-row gap-x-[24px]">
          <div className="flex-2 flex flex-col">
          {/* can change the size of calendar text w css */}
            <InitialCalendar />
            <div className="text-left font-semibold mt-[40px] mb-[18px]">
              Signup Availability
            </div>
            <label className="flex flex-col text-left gap-[26px] pl-[9px]">
              <div className="flex flex-row items-center gap-[9px]">
                <input
                  type="radio"
                  value="open"
                  checked={availability === "open"}
                  onChange={(e) => setAvailability(e.target.value as "open")}
                  className="size-[20px]"
                />
                <span>Open</span>
              </div>
              <div className="flex flex-row items-center gap-[9px]">
                <input
                  type="radio"
                  value="closed"
                  checked={availability === "closed"}
                  onChange={(e) => setAvailability(e.target.value as "closed")}
                  className="size-[20px]"
                />
                <span>Closed</span>
              </div>
            </label>
          </div>
          <div className="flex-1 flex flex-col gap-y-[32px]"> 
            <EventCard
              title="Community Cleanup"
              start={new Date("2025-02-10T09:00:00")}
              end={new Date("2025-02-10T12:00:00")}
              address="123 Main Street, Boston, MA"
              volunteers={10}
              maxVolunteers={20}
              width="100%"
            />
            <EventCard
              title="Community Cleanup"
              start={new Date("2025-02-10T09:00:00")}
              end={new Date("2025-02-10T12:00:00")}
              address="123 Main Street, Boston, MA"
              volunteers={10}
              maxVolunteers={20}
              width="100%"
            />
            <EventCard
              title="Community Cleanup"
              start={new Date("2025-02-10T09:00:00")}
              end={new Date("2025-02-10T12:00:00")}
              address="123 Main Street, Boston, MA"
              volunteers={10}
              maxVolunteers={20}
              width="100%"
            />
          </div>
        </div>
      {/* </div> */}
      
    </div>
  );
}
