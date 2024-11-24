import React from "react";

interface IEventsLayoutProps {
  children: React.ReactNode;
}

const EventsLayout = ({ children }: IEventsLayoutProps) => {
  return <div> {children} </div>;
};

export default EventsLayout;
