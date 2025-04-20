"use client";

import React from "react";
import { Icon } from "@iconify/react";
import ProfileAvatar from "@components/ProfileAvatar";
import { Role, VolunteerSession } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RadioButton from "@components/RadioButton";
import StatsCard from "@components/StatsCard";
import { getVolunteerSessions } from "@api/volunteerSession/route.client";
import TimeTable from "@components/TimeTable";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [hours, setHours] = React.useState<string>("0.0");
  const [days, setDays] = React.useState<number>(0);

  const [volunteerSessions, setVolunteerSessions] = React.useState<
    VolunteerSession[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVolunteerSessions(session ? session.user.id : "");

        if (res && res.data) {
          const sessions = res.data;

          // Total hours worked (sum of defined durationHours)
          const totalHours = sessions.reduce(
            (acc: number, session: VolunteerSession) => {
              return acc + (session.durationHours ?? 0);
            },
            0
          );

          // Total days volunteered (unique days based on dateWorked)
          const uniqueDays = new Set(
            sessions.map((session: VolunteerSession) =>
              new Date(session.dateWorked).toDateString()
            )
          );

          setHours(totalHours.toFixed(1)); // rounded to 1 decimal
          setDays(uniqueDays.size);
          setVolunteerSessions(sessions);
        }
      } catch (err) {
        console.error("Failed to fetch volunteer sessions:", err);
      }
    };

    fetchData();
  }, [session]);

  if (!session) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
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
            <div className="text-2xl font-bold text-[#101828]">
              {session.user.firstName} {session.user.lastName}
            </div>
            <div className="font-normal text-[#344054]">
              {session.user.email}
            </div>
          </div>
        </div>
        {session.user.role === Role.ADMIN ? (
          <button
            onClick={() => router.push("/private/profile/edit")}
            className="flex items-center gap-2 bg-teal-600 p-2.5 px-3 text-white rounded-md font-semibold"
          >
            <Icon icon="ic:round-edit" width="24" height="20" />
            Edit
          </button>
        ) : null}
      </div>

      {/* Main Form */}
      <div className="flex flex-col gap-8">
        {session.user.role === Role.VOLUNTEER ? (
          <>
            <div className="flex items-center gap-3">
              <Icon icon="ic:round-timeline" height={44} />
              <div className="font-bold font-['Kepler_Std'] text-4xl">
                Volunteer Sessions
              </div>
            </div>
            <div className="flex justify-between">
              <div>Personal Stats</div>
              <div className="flex gap-4">
                <StatsCard
                  heading="Personal volunteer hours"
                  value={hours}
                  icon="tabler:clock-check"
                />
                <StatsCard
                  heading="Days volunteered"
                  value={days}
                  icon="mdi:calendar-outline"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div>Volunteer Timesheet</div>
              <div className="w-[736px]">
                <TimeTable volunteerSessions={volunteerSessions} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:person-rounded" height={44} />
                <div className="font-bold font-['Kepler_Std'] text-4xl">
                  Personal Information
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
            {/* Are You Over 14 Field */}
            <div className="flex">
              <div className="w-1/3">
                <div className="font-bold text-[#344054] mb-1">
                  Are you over 14? <span className="text-[#E61932]">*</span>
                </div>
                <div className="text-sm font-normal text-[#667085]">
                  Note: we require volunteers to be over 14 years old to work
                  with us.
                </div>
              </div>
              <div className="flex gap-8 flex-grow">
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
              <div className="font-bold text-[#344054] w-1/3">
                Is this your first time volunteering with us?{" "}
                <span className="text-[#E61932]">*</span>
              </div>
              <div className="flex gap-8 items-center flex-grow">
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
            <div className="flex">
              <div className="w-1/3 font-bold text-[#344054]">
                Address <span className="text-[#E61932]">*</span>
              </div>
              <div className="flex flex-col gap-4 flex-grow">
                {/* Street Field */}
                <div className="flex-1">
                  <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                    <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                      {session.user.volunteerDetails?.address || ""}
                    </div>
                  </div>
                  <div className="w-full h-0 border-t border-[#101828]"></div>
                </div>
                {/* City, Zip Code, State, Country Row */}
                <div className="flex gap-4">
                  {/* City Field */}
                  <div className="w-1/2">
                    <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                      <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                        {session.user.volunteerDetails?.city || ""}
                      </div>
                    </div>
                    <div className="w-full h-0 border-t border-[#101828]"></div>
                  </div>
                  {/* Zip Code Field */}
                  <div className="w-1/2">
                    <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                      <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                        {session.user.volunteerDetails?.zipCode || ""}
                      </div>
                    </div>
                    <div className="w-full h-0 border-t border-[#101828]"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  {/* State Field */}
                  <div className="w-1/2">
                    <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                      <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                        {session.user.volunteerDetails?.state || ""}
                      </div>
                    </div>
                    <div className="w-full h-0 border-t border-[#101828]"></div>
                  </div>
                  {/* Country Field */}
                  <div className="w-1/2">
                    <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-center">
                      <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                        {session.user.volunteerDetails?.country || ""}
                      </div>
                    </div>
                    <div className="w-full h-0 border-t border-[#101828]"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Driver's License Field */}
            <div className="flex items-center">
              <div className="w-1/3 font-bold text-[#344054]">
                Do you have a driver&apos;s license?{" "}
                <span className="text-[#E61932]">*</span>
              </div>
              <div className="flex gap-8 items-center flex-grow">
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
              <div className="w-1/3 font-bold text-[#344054]">
                Do you speak Spanish? <span className="text-[#E61932]">*</span>
              </div>
              <div className="flex gap-8 items-center flex-grow">
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
              <div className="w-1/3 font-bold text-[#344054]">
                Why do you want to volunteer with us?{" "}
                <span className="text-[#E61932]">*</span>
              </div>
              <div className="flex-1">
                <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                  <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                    {session.user.volunteerDetails?.whyJoin || ""}
                  </div>
                </div>
                <div className="w-full h-0 border-t border-[#101828]"></div>
              </div>
            </div>
            {/* Questions/Comments Field */}
            <div className="flex items-center">
              <div className="w-1/3 font-bold text-[#344054]">
                Do you have any other questions or comments?
              </div>
              <div className="flex-1">
                <div className="w-full h-[56px] bg-[#F9FAFB] rounded-t-md overflow-hidden flex flex-col justify-start items-start">
                  <div className="w-full px-3 py-4 inline-flex justify-start items-center whitespace-normal break-words">
                    {session.user.volunteerDetails?.comments || ""}
                  </div>
                </div>
                <div className="w-full h-0 border-t border-[#101828]"></div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
