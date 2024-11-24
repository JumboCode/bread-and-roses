import React from "react";

interface IACommunicationLayoutProps {
  children: React.ReactNode;
}

const CommunicationLayout = ({ children }: IACommunicationLayoutProps) => {
  return <div> {children} </div>;
};

export default CommunicationLayout;
