"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function WindowSizeCheck() {
  const [windowDimension] = useState(getWindowDimensions());
  if (windowDimension.width < 375 || windowDimension.height < 375) {
    // perhaps change the width and height dimensions?
    // use useEffect to display the error image?
    // return a bool? like true
    // or return the html error page

    // error image
    <Image
      src={"/empty_list.png"}
      alt="Logo" // idk what this is
      layout="responsive"
      width={215}
      height={173}
      className=""
    />;
  }

  return windowDimension; // TODO return something other than dimension
}

// <Image
//     src={"/logo1.png"}
//     alt="Logo"
//     layout="responsive"
//     width={215}
//     height={173}
//     className=""
//   />
