import React from "react";

interface IVolunteersLayoutProps {
  children: React.ReactNode;
}

const VolunteersLayout = ({ children }: IVolunteersLayoutProps) => {
  return <div> {children} </div>;
};

export default VolunteersLayout;
