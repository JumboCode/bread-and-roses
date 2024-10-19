"use client";

import StatsCard from "@components/StatsCard";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <StatsCard
      heading = "Total Voluteers"
      value = "50"
      icon = "formkit:people" //icon id
      date = "October 5, 2024"
      />
    </div>
  );
}
