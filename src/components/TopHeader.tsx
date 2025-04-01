"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Role } from "@prisma/client";
import React from "react";
import { useEffect } from "react";
import { VolunteerDetails } from "../types/next-auth";
import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { setLanguageCookie } from "../lib/languages";
import { getLanguageFromCookie } from "../lib/languages";

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
  const { t, i18n } = useTranslation("translation");

  useEffect(() => {
    // Set the language from the cookie on page load
    const savedLanguage = getLanguageFromCookie();
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  // different button text and icon depending on if the user is a volunteer or admin
  const buttonText = user.role === Role.ADMIN ? "Add Event" : t("check_in");
  const icon =
    user.role === Role.ADMIN ? "ic:baseline-plus" : "mdi:checkbox-outline";

  const [isEnglish, setIsEnglish] = React.useState(
    getLanguageFromCookie() === "en"
  );
  const toggleLanguage = (): void => {
    setIsEnglish(!isEnglish);
    const newLang = i18n.language === "en" ? "es" : "en"; // Toggle between 'en' and 'es'
    i18n.changeLanguage(newLang);
    setLanguageCookie(newLang); // Save the new language in the cookie
  };

  const getTitle = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[2].charAt(0).toUpperCase() + pathSegments[2].slice(1);
  };

  return (
    <div className="w-[calc(100vw-240px)] top-0 left-60 right-0 flex items-center justify-between border-gray-200 border-y py-5 px-6 sticky z-10 bg-white">
      {pathname === "/private" ? (
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
              onChange={() => toggleLanguage()}
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
            <h2 className="text-gray-500">{t(user.role.toLowerCase())}</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopHeader;
