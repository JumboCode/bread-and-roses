import React from "react";

interface IProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: IProfileLayoutProps) => {
  return <div> {children} </div>;
};

export default ProfileLayout;
