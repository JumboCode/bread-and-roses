"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import EventCard from "@components/EventCard";
import StatsCard from "@components/EventCard";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <EventCard
        title="Dewick Community Meal"
        date="12:30 - 9:30 PM"
        address="25 Latin Way, Medford, MA 02155"
        volunteers={25}
        maxVolunteers = {30}
      />
    </div>
  );
}
