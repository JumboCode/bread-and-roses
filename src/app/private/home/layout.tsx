import React from "react";

interface IAdminHomeLayoutProps {
  children: React.ReactNode;
}

const AdminHomeLayout = ({ children }: IAdminHomeLayoutProps) => {
  return <div> {children} </div>;
};

export default AdminHomeLayout;
