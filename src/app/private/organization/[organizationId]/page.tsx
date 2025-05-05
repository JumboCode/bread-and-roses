"use client";

import React from "react";
import { Icon } from "@iconify/react";
import ProfileAvatar from "@components/ProfileAvatar";
import StatsCard from "@components/StatsCard";
import TimeTable from "@components/TimeTable";
import { Calendar } from "@components/Calendar";
import { format } from "date-fns";
import { InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { OrganizationWithUsers } from "../../../types";
import { useSession } from "next-auth/react";
import { getOrganization } from "@api/organization/route.client";
import VolunteerTable from "@components/VolunteerTable";
import { useTranslation } from "react-i18next";

export default function ProfileContent() {
  const { organizationId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("profile");

  const startButtonRef = React.useRef(null);
  const startCalendarRef = React.useRef<HTMLDivElement>(null);
  const endButtonRef = React.useRef(null);
  const endCalendarRef = React.useRef<HTMLDivElement>(null);

  const [organization, setOrganization] =
    React.useState<OrganizationWithUsers | null>(null);
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (status === "loading" || !session?.user) return;

    if (
      session.user.organizationId !== organizationId &&
      session.user.role !== "ADMIN"
    ) {
      router.replace(`/private/profile/${session.user.id}`);
      return;
    }

    const fetchData = async () => {
      try {
        if (!organizationId) return;

        const response = await getOrganization(organizationId as string);

        if (response.data) {
          setOrganization(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId, router, session?.user, status]);

  const filteredSessions = React.useMemo(() => {
    if (organization?.volunteerSessions) {
      return organization.volunteerSessions.filter((session) => {
        const sessionDate = new Date(session.dateWorked);
        return (
          (!selectedStartDate || sessionDate >= selectedStartDate) &&
          (!selectedEndDate || sessionDate <= selectedEndDate)
        );
      });
    } else {
      return [];
    }
  }, [organization?.volunteerSessions, selectedStartDate, selectedEndDate]);

  const [hours, setHours] = React.useState("0.0");
  const [days, setDays] = React.useState(0);

  React.useEffect(() => {
    const totalHours = filteredSessions.reduce((acc, session) => {
      return acc + (session.durationHours ?? 0);
    }, 0);

    const uniqueDays = new Set(
      filteredSessions.map((session) =>
        new Date(session.dateWorked).toDateString()
      )
    );

    setHours(totalHours.toFixed(1));
    setDays(uniqueDays.size);
  }, [filteredSessions]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        startCalendarRef.current &&
        event.target instanceof Node &&
        !startCalendarRef.current.contains(event.target)
      ) {
        setShowStartCalendar(false);
      }
      if (
        endCalendarRef.current &&
        event.target instanceof Node &&
        !endCalendarRef.current.contains(event.target)
      ) {
        setShowEndCalendar(false);
      }
    }

    if (showStartCalendar || showEndCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartCalendar, showEndCalendar]);

  if (loading || !organization) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        {t("loading")}...
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
                firstName={organization.name}
                lastName=""
                bgColor="#FFF0F1"
                textColor="#9A0F28"
              />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#101828]">
              {organization.name}
            </div>
            <div className="font-normal text-[#344054]">
              {t("organization")}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon icon="ic:round-timeline" height={44} />
            <div className="font-bold font-['Kepler_Std'] text-4xl">
              {t("group_log")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div ref={startCalendarRef}>
              <TextField
                className="border border-gray-300 rounded-md px-3 py-2 w-[215.5px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="MM/DD/YYYY"
                variant="outlined"
                label={t("start_date")}
                autoComplete="off"
                size="small"
                onFocus={() => setShowStartCalendar(!showStartCalendar)}
                value={
                  selectedStartDate
                    ? format(selectedStartDate, "MM/dd/yyyy")
                    : ""
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <button
                          ref={startButtonRef}
                          onClick={() =>
                            setShowStartCalendar(!showStartCalendar)
                          }
                        >
                          <Icon icon={"mdi:calendar"} width="25" />
                        </button>
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              {showStartCalendar && (
                <div
                  style={{
                    position: "absolute",
                    top: "331px",
                    zIndex: 10,
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Calendar
                    selectedDate={selectedStartDate ?? undefined}
                    setSelectedDate={(date) => {
                      if (date) {
                        setSelectedStartDate(date);
                        setShowStartCalendar(false);
                      }
                    }}
                    previousDisabled={false}
                  />
                </div>
              )}
            </div>
            <div>—</div>
            <div ref={endCalendarRef}>
              <TextField
                className="border border-gray-300 rounded-md px-3 py-2 w-[215.5px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="MM/DD/YYYY"
                variant="outlined"
                label={t("end_date")}
                autoComplete="off"
                size="small"
                onFocus={() => setShowEndCalendar(!showEndCalendar)}
                value={
                  selectedEndDate ? format(selectedEndDate, "MM/dd/yyyy") : ""
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <button
                          ref={endButtonRef}
                          onClick={() => setShowEndCalendar(!showEndCalendar)}
                        >
                          <Icon icon={"mdi:calendar"} width="25" />
                        </button>
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              {showEndCalendar && (
                <div
                  style={{
                    position: "absolute",
                    top: "331px",
                    right: "24px",
                    zIndex: 10,
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Calendar
                    selectedDate={selectedEndDate ?? undefined}
                    setSelectedDate={(date) => {
                      if (date) {
                        setSelectedEndDate(date);
                        setShowEndCalendar(false);
                      }
                    }}
                    previousDisabled={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>{t("group_stats")}</div>
          <div className="flex gap-4">
            <StatsCard
              heading={t("personal_volunteer_hours")}
              value={hours}
              icon="tabler:clock-check"
            />
            <StatsCard
              heading={t("days_volunteered")}
              value={days}
              icon="mdi:calendar-outline"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div>{t("group_timesheet")}</div>
          <div className="w-[736px]">
            {filteredSessions.length === 0 ? (
              <div className="text-center">
                <div className="relative w-full h-[30vh]">
                  <Image
                    src="/empty_list.png"
                    alt="Empty List"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="text-[#344054] font-['Kepler_Std'] text-2xl font-semibold mt-8">
                  {t("no_time_slots_in_range")}
                </div>
              </div>
            ) : (
              <TimeTable volunteerSessions={filteredSessions} />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:people-rounded" height={44} />
            <div className="font-bold font-['Kepler_Std'] text-4xl">
              {t("people")}
            </div>
          </div>
        </div>
        {organization.users?.length === 0 ? (
          <div className="text-center">
            <div className="relative w-full h-[50vh]">
              <Image
                src="/empty_list.png"
                alt="Empty List"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="text-[#344054] font-['Kepler_Std'] text-3xl font-semibold mt-8">
              No volunteers found!
            </div>
          </div>
        ) : (
          <VolunteerTable
            showPagination={true}
            fromVolunteerPage={false}
            fromAttendeePage={false}
            users={organization.users}
          />
        )}
      </div>
    </div>
  );
}
