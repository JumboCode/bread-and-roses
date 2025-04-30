"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Role } from "@prisma/client";
import React, { useState } from "react";
import { useEffect } from "react";
import { VolunteerDetails } from "../types/next-auth";
import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { setLanguageCookie } from "../lib/languages";
import { getLanguageFromCookie } from "../lib/languages";
import CustomizeEventModal from "./CustomizeEventModal";
import GroupSignUpModal from "@components/GroupSignUpModal";

interface TopHeaderProps {
  user: {
    id: string;
    role: "VOLUNTEER" | "ADMIN";
    firstName: string;
    lastName: string;
    email: string;
    organizationId?: string | null;
    volunteerDetails?: VolunteerDetails | null;
  };
}

const TopHeader = ({ user }: TopHeaderProps) => {
  const pathname = usePathname();
  const { t, i18n } = useTranslation("translation");
  const [customizeModal, setCustomizeModal] = useState<boolean>(false);

  useEffect(() => {
    // Set the language from the cookie on page load
    const savedLanguage = getLanguageFromCookie();
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  let icon = "";

  if (pathname === "/private/events") {
    icon = "ic:baseline-plus";
  } else {
    icon =
      user.role === Role.ADMIN ? "ic:baseline-plus" : "mdi:checkbox-outline";
  }

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

  // display form when requesting group sign up
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="w-[calc(100vw-240px)] top-0 left-60 right-0 flex items-center justify-between border-gray-200 border-y py-5 px-6 sticky z-10 bg-white">
      <div className="relative">
        {pathname === "/private" ? (
          <div className="text-gray-500 text-lg">Home</div>
        ) : pathname === "/private/events" && user.role === Role.ADMIN ? (
          <button
            onClick={() => {
              setCustomizeModal(true);
            }}
            className="flex items-center justify-center w-[186px] h-[44px] rounded-[8px] px-[18px] py-[10px] gap-[8px] font-semibold bg-teal-600 text-white"
          >
            <Icon icon={icon} width="20" height="20" />
            <div className="mt-0.5">Customize Event</div>
          </button>
        ) : pathname === "/private/events" &&
          user.role === Role.VOLUNTEER &&
          user.organizationId ? (
          <>
            <button
              className="flex gap-x-2 font-semibold bg-teal-600 p-2.5 px-3 text-white rounded-md items-center"
              onClick={() => {
                if (
                  pathname === "/private/events" &&
                  user.role === Role.VOLUNTEER
                ) {
                  setShowModal(true);
                }
              }}
            >
              <Icon icon={icon} width="20" height="20" />
              <div className="mt-0.5">Sign Up As a Group</div>
            </button>

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center overflow-y-auto scrollbar-hide">
                {/* backdrop for modal that allows for scrolling */}
                <div className="rounded-xl w-full max-w-[600px] max-h-[100vh] overflow-y-auto relative scrollbar-hide">
                  {/* modal container */}
                  <GroupSignUpModal onClose={() => setShowModal(false)} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-lg">
            {getTitle() === "Organization" ? "Profile" : getTitle()}
          </div>
        )}
        <CustomizeEventModal
          modalVisible={customizeModal}
          setModalVisible={setCustomizeModal}
        ></CustomizeEventModal>
      </div>

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
