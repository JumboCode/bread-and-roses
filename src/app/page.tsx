"use client";

import TopHeader from "@components/TopHeader";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <TopHeader userType="admin" />
    </div>
  );
}
