"use client";

import React from "react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold">Profile</div>
      <div className="text-center">
        <div className="relative w-full h-[50vh]">
          <Image
            src="/empty_list.png"
            alt="Empty List"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="text-[#344054] font-['Kepler_Std'] text-3xl font-semibold mt-8">
          Coming Soon!
        </div>
      </div>
    </div>
  );
}
