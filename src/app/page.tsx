"use client";

import StatsCard from "@components/StatsCard";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <StatsCard
        heading="Total Volunteers"
        value="50"
        icon="formkit:people" //icon id
        date="October 5, 2024"
      />
      <StatsCard
        heading="Total Volunteers hours"
        value="200"
        icon="bitcoin-icons:clock-outline" //icon id
        date="October 5, 2024"
      />
      <StatsCard
        heading="Total Events"
        value="14"
        icon="mdi-light:calendar" //icon id
        date="October 5, 2024"
      />
    </div>
  );
}
