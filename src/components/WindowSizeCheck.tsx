"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }
  return { width: 1024, height: 768 };
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
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = windowDimension;
  console.log("Window dimensions:", width, height);

  // to account for ipads
  if (width < 700 || height < 530 || height > width) {
    console.log("Displaying error image due to small window size");
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <Image
          src="/empty_list.png"
          alt="Error"
          layout="intrinsic"
          width={215}
          height={173}
        />
        <h1 className="mt-4">
          Oh no! please open this website on a larger device.
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}
