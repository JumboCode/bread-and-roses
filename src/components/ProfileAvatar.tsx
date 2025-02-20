import React from "react";
import Avatar from "@mui/material/Avatar";

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
}

const ProfileAvatar = ({ firstName, lastName }: ProfileAvatarProps) => {
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
        fontSize: "64px",
        height: 144,
        width: 144,
      }}
    >
      {getInitials(firstName, lastName)}
    </Avatar>
  );
};

export default ProfileAvatar;
