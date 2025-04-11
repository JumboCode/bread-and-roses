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
  const [windowDimension, setWindowDimension] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimension(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    // Optional: Call handleResize on mount to get current dimensions.
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = windowDimension;
  console.log("Window dimensions:", width, height);

  // Adjust the thresholds below as needed.
  // For example, if you only want to show the error on small (sm) and medium (md)
  // screens, you might use a breakpoint like 768 (or another value matching your design).
  if (width < 700 || height < 530) {
    console.log("Displaying error image due to small window size");
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

  return <>{children}</>;
}
