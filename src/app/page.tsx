"use client";

import ExampleButton from "@components/ExampleButton";
import TopHeader from "@components/TopHeader";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* Example Button (ExampleButton.tsx in components folder) */}
      <TopHeader/>
      {/* <ExampleButton buttonText="Add User" /> */}
    </div>
  );
}
