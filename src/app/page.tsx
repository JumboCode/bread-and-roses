"use client";

import ExampleButton from "@components/ExampleButton";
import SideNavBar from "@components/SideNavBar";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* Example Button (ExampleButton.tsx in components folder) */}
      {/* <ExampleButton buttonText="Add User" /> */}
      <SideNavBar/>
    </div>
  );
}
