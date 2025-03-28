"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }
  return { width: 1024, height: 768 }; // Default size for SSR
}

interface WindowSizeCheckProps {
  children: React.ReactNode;
}

export default function WindowSizeCheck({ children }: WindowSizeCheckProps) {
  // get the width and height of the current window
  const [windowDimension] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      // setWindowDimension(getWindowDimensions()); // Update state on resize
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = getWindowDimensions();

  // DEBUG
  console.log(width, height);

  // if the width or height is less than 600, display error image
  if (width < 600 || height < 600) {
    // DEBUG
    console.log("here1");

    return (
      <div className="flex justify-center items-center h-screen">
        <Image
          src="/empty_list.png"
          alt="Error"
          layout="intrinsic"
          width={215}
          height={173}
        />
      </div>
    );
  }

  // DEBUG
  console.log("here2");

  return <>{children}</>;
}
