import React from "react";

interface IACheckInOutLayoutProps {
  children: React.ReactNode;
}

const CheckInOutLayout = ({ children }: IACheckInOutLayoutProps) => {
  return <div>{children}</div>;
};

export default CheckInOutLayout;