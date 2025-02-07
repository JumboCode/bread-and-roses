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
              title="Dewick Community Meal"
              start={new Date("December 10, 2024 11:20:00")}
              end={new Date("December 17, 2024 13:20:00")}
              address="25 Latin Way, Medford, MA 02155"
              volunteers={10}
              maxVolunteers={15}
              width="100%"
              imageSrc="/event-card-placeholder.png"
            />
            <EventCard
              title="Carmichael Grab & Go Meal"
              start={new Date("December 10, 2024 12:30:00")}
              end={new Date("December 17, 2024 14:00:00")}
              address="200 Packard Ave, Medford, MA 02155"
              volunteers={15}
              maxVolunteers={15}
              width="100%"
              imageSrc="/event-card-placeholder.png"
            />
            <EventCard
              title="Hodgedon Food-on-the-run"
              start={new Date("December 10, 2024 14:20:00")}
              end={new Date("December 17, 2024 14:30:00")}
              address="103 Talbot Ave. Somerville, MA 02144"
              volunteers={10}
              maxVolunteers={15}
              width="100%"
              imageSrc="/event-card-placeholder.png"
            />
            <div className="w-full border-b border-0.5 border-[#E4E7EC]">
                {" "}
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex justify-start mb-8">  Page 1 of 10 </div>
              <div className="flex flex-row justify-end gap-4 font-bold">
                <button className="mb-8 bg-white-50 border-2 border-gray-200 w-32 h-[45px] rounded-xl text-teal-900">
                  Previous
                </button>
                <button className="mb-8 bg-white-50 border-2 border-gray-200 w-24 h-[45px] rounded-xl text-teal-900">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

      
    </div>
  );
}
