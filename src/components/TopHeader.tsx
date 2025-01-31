"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Role } from "@prisma/client";
import React from "react";
import { VolunteerDetails } from "../types/next-auth";
import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TopHeaderProps {
  user: {
    id: string;
    role: "VOLUNTEER" | "ADMIN";
    firstName: string;
    lastName: string;
    email: string;
    volunteerDetails?: VolunteerDetails | null;
  };
}

const TopHeader = ({ user }: TopHeaderProps) => {
  const pathname = usePathname();

  // different button text and icon depending on if the user is a volunteer or admin
  const buttonText = user.role === Role.ADMIN ? "Add Event" : "Check in";
  const icon =
    user.role === Role.ADMIN ? "ic:baseline-plus" : "mdi:checkbox-outline";

  const [isEnglish, setIsEnglish] = React.useState(true);

  const getTitle = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[2].charAt(0).toUpperCase() + pathSegments[2].slice(1);
  };

  return (
    <div className="w-[calc(100vw-240px)] top-0 left-60 right-0 flex items-center justify-between border-gray-200 border-y py-5 px-6 sticky z-10 bg-white">
      {pathname === "/private" || pathname === "/private/events" ? (
        <button className="flex gap-x-2 font-semibold bg-teal-600 p-2.5 px-3 text-white rounded-md items-center">
          <Icon icon={icon} width="20" height="20" />
          <div className="mt-0.5">{buttonText}</div>
        </button>
      ) : (
        <div className="text-gray-500 text-lg">{getTitle()}</div>
      )}
      <div className="flex flex-row justify-self-end place-items-center gap-x-2">
        <h1 className={`${!isEnglish ? "text-teal-600" : ""} font-medium`}>
          SP
        </h1>

        {/* making toggle switch from scratch*/}
        <div>
          <label
            htmlFor="check"
            className="flex bg-gray-200 cursor-pointer relative w-[36px] h-[20px] rounded-full"
          >
            <input
              type="checkbox"
              id="check"
              className="sr-only peer"
              checked={isEnglish}
              onChange={() => setIsEnglish(!isEnglish)}
            />
            <span className="w-[16px] h-[16px] bg-teal-600 absolute rounded-full left-1 top-0.5 peer-checked:left-4 transition-all duration-500" />
          </label>
        </div>

        <h1 className={`${isEnglish ? "text-teal-600" : ""} font-medium mr-2`}>
          EN
        </h1>
        <Link className="flex flex-row gap-3" href="/private/profile">
          <UserAvatar firstName={user.firstName} lastName={user.lastName} />
          <div>
            <h1 className="font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <h2 className="text-gray-500">{user.role.toLowerCase()}</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopHeader;
