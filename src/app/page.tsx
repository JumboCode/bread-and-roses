"use client";

import ExampleButton from "@/components/ExampleButton";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* Example Button (ExampleButton.tsx in components folder) */}
      <ExampleButton buttonText="Add User" />
    </div>
  );
}
