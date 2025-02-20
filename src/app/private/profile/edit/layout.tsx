import React from "react";

interface IProfileEditLayoutProps {
  children: React.ReactNode;
}

const ProfileEditLayout = ({ children }: IProfileEditLayoutProps) => {
  return <div>{children}</div>;
};

export default ProfileEditLayout;
