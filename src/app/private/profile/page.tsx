"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import UserAvatar from "@components/UserAvatar";
import ProfileAvatar from "@components/ProfileAvatar";
import { getUser } from "@api/user/route.client";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

type RadioButtonProps = {
  label: string;
  checked: boolean;
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, checked }) => {
  return (
    <div className="w-[332px] h-[42px] inline-flex justify-between items-start">
      <div
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-[42px] h-[42px] flex items-center justify-center">
          {checked ? (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_yes)">
                <path
                  d="M21 16C18.24 16 16 18.24 16 21C16 23.76 18.24 26 21 26C23.76 26 26 23.76 26 21C26 18.24 23.76 16 21 16ZM21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.58 29 13 25.42 13 21C13 16.58 16.58 13 21 13C25.42 13 29 16.58 29 21C29 25.42 25.42 29 21 29Z"
                  fill="#1976D2"
                />
              </g>
              <defs>
                <clipPath id="clip0_yes">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_no)">
                <path
                  d="M21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.58 29 13 25.42 13 21C13 16.58 16.58 13 21 13C25.42 13 29 16.58 29 21C29 25.42 25.42 29 21 29Z"
                  fill="black"
                  fillOpacity="0.6"
                />
              </g>
              <defs>
                <clipPath id="clip0_no">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </div>
        <div className="inline-flex flex-col items-start">
          <div
            className="text-[#344054] text-[16px] font-['Sofia Pro'] font-normal leading-6"
            style={{ wordWrap: "break-word" }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await getUser(userId);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (!session) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto w-[1192px] min-h-[994px] p-[24px] px-[28px] flex flex-col gap-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-[144px] h-[144px] rounded-full border-4 border-white shadow-lg overflow-hidden">
              <ProfileAvatar
                firstName={session.user.firstName}
                lastName={session.user.lastName}
              />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold font-['Sofia Pro'] text-[#101828]">
              {session.user.firstName} {session.user.lastName}
            </div>
            <div className="text-base font-normal font-['Sofia Pro'] text-[#344054]">
              {session.user.email}
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push("/private/profile/edit")}
          className="flex items-center gap-2 bg-teal-600 p-2.5 px-3 text-white rounded-md font-semibold"
        >
          <Icon icon="ic:round-edit" width="24" height="20" />
          Edit
        </button>
      </div>

      {/* Main Form */}
      <div className="flex flex-col gap-8">
        {/* Password Field */}
        <div className="flex items-center">
          <div className="w-[400px] text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Password <span className="text-[#E61932]">*</span>
          </div>
          <div className="flex flex-col gap-4 flex-1">
              <div className="flex-1 ml-4">
                <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                <input
                  type="password"
                  value="********"
                  readOnly
                  className="w-full h-full p-4 text-lg text-[#101828] font-normal font-['Sofia Pro'] bg-transparent outline-none"
                />
                </div>
                <div className="w-full h-0 border-t border-[#101828]"></div>
              </div>
          </div>
        </div>

        {/* Are You Over 14 Field */}
        <div className="flex items-center">
          <div className="w-[400px]">
            <div className="text-lg font-bold font-['Sofia Pro'] text-[#344054]">
              Are you over 14? <span className="text-[#E61932]">*</span>
            </div>
            <div className="text-sm font-normal font-['Sofia Pro'] text-[#667085]">
              Note: we require volunteers to be over 14 years old to work with us.
            </div>
          </div>
          <div className="flex gap-8 items-center ml-4">
            <RadioButton
              label="Yes"
              checked={session.user.volunteerDetails?.ageOver14 === true}
            />
            <RadioButton
              label="No"
              checked={session.user.volunteerDetails?.ageOver14 === false}
            />
          </div>
        </div>

        {/* First Time Volunteering Field */}
        <div className="flex items-center">
          <div className="w-[400px] text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Is this your first time volunteering with us?{" "}
            <span className="text-[#E61932]">*</span>
          </div>
          <div className="flex gap-8 items-center ml-4">
            <RadioButton
              label="Yes"
              checked={session.user.volunteerDetails?.firstTime === true}
            />
            <RadioButton
              label="No"
              checked={session.user.volunteerDetails?.firstTime === false}
            />
          </div>
        </div>

        {/* Address Field */}
        <div className="flex items-start gap-4 ml-auto">
          {/* Label Column */}
          <div className="w-[400px]">
            <span className="text-lg font-bold font-['Sofia Pro'] text-[#344054]">
              Address
            </span>
            <span className="text-lg font-bold font-['Sofia Pro'] text-[#E61932]">
              *
            </span>
          </div>
          {/* Input Column */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Street Field */}
            <div className="flex">
              <div className="flex-1">
                <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                  <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                    {session.user.volunteerDetails?.address || ""}
                  </div>
                </div>
                <div className="w-full h-0 border-t border-[#101828]"></div>
              </div>
            </div>
            {/* City and Zip Code Row */}
            <div className="flex gap-4">
              {/* City Field */}
              <div className="flex flex-col">
                <div className="w-[360px] h-[56px] inline-flex flex-col justify-start items-start">
                  <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                    <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                      {session.user.volunteerDetails?.city || ""}
                    </div>
                  </div>
                  <div className="w-[360px] h-0 border-t border-[#101828]"></div>
                </div>
              </div>
              {/* Zip Code Field */}
              <div className="flex flex-col">
                <div className="w-[360px] h-[56px] inline-flex flex-col justify-start items-start">
                  <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                    <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                      {session.user.volunteerDetails?.zipCode || ""}
                    </div>
                  </div>
                  <div className="w-[360px] h-0 border-t border-[#101828]"></div>
                </div>
              </div>
            </div>
            {/* State and Country Row */}
            <div className="flex gap-4">
              {/* State Field */}
              <div className="flex flex-col">
                <div className="w-[360px] h-[56px] inline-flex flex-col justify-start items-start">
                  <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                    <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                      {session.user.volunteerDetails?.state || ""}
                    </div>
                  </div>
                  <div className="w-[360px] h-0 border-t border-[#101828]"></div>
                </div>
              </div>
              {/* Country Field */}
              <div className="flex flex-col">
                <div className="w-[360px] h-[56px] inline-flex flex-col justify-start items-start">
                  <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-center">
                    <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                      {session.user.volunteerDetails?.country || ""}
                    </div>
                  </div>
                  <div className="w-[360px] h-0 border-t border-[#101828]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Driver's License Field */}
        <div className="flex items-center">
          <div className="w-[400px] text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Do you have a driver's license?{" "}
            <span className="text-[#E61932]">*</span>
          </div>
          <div className="flex gap-8 items-center ml-4">
            <RadioButton
              label="Yes"
              checked={session.user.volunteerDetails?.hasLicense === true}
            />
            <RadioButton
              label="No"
              checked={session.user.volunteerDetails?.hasLicense === false}
            />
          </div>
        </div>

        {/* Speak Spanish Field */}
        <div className="flex items-center">
          <div className="w-[400px] text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Do you speak Spanish?{" "}
            <span className="text-[#E61932]">*</span>
          </div>
          <div className="flex gap-8 items-center ml-4">
            <RadioButton
              label="Yes"
              checked={session.user.volunteerDetails?.speaksEsp === true}
            />
            <RadioButton
              label="No"
              checked={session.user.volunteerDetails?.speaksEsp === false}
            />
          </div>
        </div>

        {/* Volunteer Reason Field */}
        <div className="flex items-center">
          <div className="w-[400px] text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Why do you want to volunteer with us?{" "}
            <span className="text-[#E61932]">*</span>
          </div>
          <div className="flex-1 flex flex-col ml-4">
            <textarea
              readOnly
              value={session.user.volunteerDetails?.whyJoin || ""}
              className="w-full h-[56px] bg-[#F9FAFB] p-4 text-lg text-[#101828] font-normal font-['Sofia Pro'] rounded-t-md resize-none overflow-hidden"
            />
            <div className="w-full h-0 border-t border-[#101828]"></div>
          </div>
        </div>

        {/* Questions/Comments Field */}
        <div className="flex items-center">
          <div className="w-[400px] text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Do you have any other questions or comments?
          </div>
          <div className="flex-1 flex flex-col ml-4">
            <textarea
              readOnly
              value={session.user.volunteerDetails?.comments || ""}
              className="w-full h-[56px] bg-[#F9FAFB] p-4 text-lg text-[#101828] font-normal font-['Sofia Pro'] rounded-t-md resize-none overflow-hidden"
            />
            <div className="w-full h-0 border-t border-[#101828]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
