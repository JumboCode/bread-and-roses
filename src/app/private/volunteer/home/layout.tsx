import React from "react";

interface VolunteerHomeLayoutProps {
  children: React.ReactNode;
}

const VolunteerHomeLayout = ({ children }: VolunteerHomeLayoutProps) => {
  return <div> {children} </div>;
};

export default VolunteerHomeLayout;
