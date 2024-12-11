import React from "react";
import Avatar from "@mui/material/Avatar";

interface UserAvatarProps {
  firstName: string;
  lastName: string;
}

const UserAvatar = ({ firstName, lastName }: UserAvatarProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <Avatar
      sx={{
        bgcolor: "#00796B",
        fontWeight: "bold",
        fontSize: "18px",
        height: 42,
        width: 42,
      }}
    >
      {getInitials(firstName, lastName)}
    </Avatar>
  );
};

export default UserAvatar;
