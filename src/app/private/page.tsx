"use client";

import { useSession } from "next-auth/react";
import StatsCard from "@components/StatsCard";
import EventCard from "@components/EventCard";
import VolunteerTable from "@components/VolunteerTable";
import {
  Role,
  Event,
  TimeSlot,
  TimeSlotStatus,
  VolunteerSession,
} from "@prisma/client";
import React, { useEffect } from "react";
import { getUser, getUsersByRole } from "@api/user/route.client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { UserWithVolunteerDetail } from "../types";
import { getAllEvents } from "../api/event/route.client";
import { useTranslation } from "react-i18next";
import { getTimeSlots, getTimeSlotsByStatus } from "@api/timeSlot/route.client";
import { getStandardDateString, sortedReadableTimeSlots } from "../utils";
import Image from "next/image";
import { getAllVolunteerSessions } from "@api/volunteerSession/route.client";

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation(["translation", "home"]);
  const { data: session } = useSession();
  const [users, setUsers] = React.useState<UserWithVolunteerDetail[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([]);
  const [daySlots, setDaySlots] = React.useState<{
    [key: string]: Set<string>;
  }>({});
  const [sessions, setSessions] = React.useState<VolunteerSession[]>([]);
  const [hours, setHours] = React.useState("...");
  const [days, setDays] = React.useState(0);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (session?.user.role === Role.VOLUNTEER) {
        const userRes = await getUser(session?.user.id as string);
        const res = await getTimeSlots(session?.user.id as string);
        const now = new Date();
        const upcomingSlots = res.data.filter(
          (slot: TimeSlot) => new Date(slot.startTime) > now
        );

        setSessions(userRes.data.volunteerSessions);
        setTimeSlots(upcomingSlots);
      } else if (session?.user.role === Role.ADMIN) {
        const res = await getTimeSlotsByStatus(TimeSlotStatus.AVAILABLE);
        const sessionsRes = await getAllVolunteerSessions();
        console.log(sessionsRes.data);

        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const daysAhead = 3;
        const daySlotsTemp: { [key: string]: Set<string> } = {};

        for (let i = 0; i < daysAhead; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);

          const dateString = date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          daySlotsTemp[dateString] = new Set();
        }

        res.data.forEach((timeSlot: TimeSlot) => {
          const start = new Date(timeSlot.startTime);
          const dateString = start.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          if (daySlotsTemp[dateString]) {
            daySlotsTemp[dateString].add(timeSlot.id);
          }
        });

        setSessions(sessionsRes.data);
        setDaySlots(daySlotsTemp);
      }
    };

    fetchTimeSlots();
  }, [session?.user.id, session?.user.role]);

  React.useEffect(() => {
    const totalHours = sessions.reduce((acc, session) => {
      return acc + (session.durationHours ?? 0);
    }, 0);

    const uniqueDays = new Set(
      sessions.map((session) => new Date(session.dateWorked).toDateString())
    );

    setHours(totalHours.toFixed(1));
    setDays(uniqueDays.size);
  }, [sessions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, eventsResponse] = await Promise.all([
          getUsersByRole(Role.VOLUNTEER),
          getAllEvents(),
        ]);

        setUsers(usersResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!session) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
  }

  const formatVolunteerSubtexts = (startTime: Date, endTime: Date) => {
    const dateText = new Date(startTime).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timeText =
      new Date(startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }) +
      " - " +
      new Date(endTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

    return [
      { text: dateText, icon: "tabler:calendar" },
      { text: timeText, icon: "majesticons:clock" },
    ];
  };

  const cardButton = (action: () => void) => (
    <button
      className="flex justify-end flex-row gap-x-2 bg-teal-600 px-3.5 py-1 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]"
      onClick={action}
    >
      {session.user.role === Role.VOLUNTEER ? t("Manage") : t("See details")}
    </button>
  );

  return (
    <div>
      <div>
        <h1 className="text-4xl font-semibold	leading-10 font-['Kepler_Std']">
          {t("welcome_title", { ns: "home" })}, {session.user.firstName} 👋
        </h1>
        <h1 className="text-lg mt-3 font-normal leading-7 font-serif text-slate-500">
          Stats updated by:{" "}
          {(() => {
            const date = new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            const parts = date.split(" ");
            return `${parts[0]}, ${parts[1]} ${parts[2]} ${parts[3]}`;
          })()}
          .
        </h1>
      </div>

      <div className="flex flex-nowrap gap-x-7 pt-8">
        {session.user.role === Role.ADMIN && (
          <StatsCard
            heading="Total volunteers"
            value={!loading ? users.length : "..."}
            icon="pepicons-pencil:people"
          />
        )}
        <StatsCard
          heading={
            session.user.role === Role.ADMIN
              ? "Total volunteer hours"
              : t("volunteer_hours", { ns: "home" })
          }
          value={hours}
          icon="tabler:clock-check"
        />
        {session.user.role === Role.VOLUNTEER && (
          <StatsCard
            heading="Days volunteered"
            value={days}
            icon="mdi:calendar-outline"
          />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mt-8 mb-4">
          <h1 className="text-2xl font-semibold leading-8 font-['Kepler_Std']">
            {session.user.role === Role.ADMIN
              ? "Upcoming Events"
              : t("upcoming_times", { ns: "home" })}
          </h1>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/private/events")}
          >
            <div className="mt-0.5 text-[#145A5A] font-semibold">
              {t("see_all")}
            </div>
            <Icon
              icon="lucide:arrow-right"
              width={20}
              height={20}
              style={{ color: "#145A5A" }}
            />
          </div>
        </div>
        <div className="w-full">
          {session.user.role === Role.VOLUNTEER ? (
            timeSlots.length === 0 ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full h-[30vh]">
                  <Image
                    src="/empty_list.png"
                    alt="Empty List"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="text-[#344054] font-['Kepler_Std'] text-2xl font-semibold mt-8">
                  It seems like you have not signed up for any time slots yet!
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-7">
                {timeSlots.slice(0, 6).map((timeSlot, index) => (
                  <EventCard
                    key={timeSlot.id}
                    title={`Time Slot ${index + 1}`}
                    subtexts={formatVolunteerSubtexts(
                      timeSlot.startTime,
                      timeSlot.endTime
                    )}
                    actionButton={cardButton(() => {
                      router.push(
                        `/private/events?date=${getStandardDateString(
                          timeSlot.startTime
                        )}`
                      );
                    })}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="flex gap-x-7">
              {sortedReadableTimeSlots(Object.keys(daySlots))
                .slice(0, 3)
                .map((date) => (
                  <EventCard
                    key={date}
                    title={date}
                    subtexts={[
                      {
                        text: "Opening Time: 10AM - 6PM",
                        icon: "tabler:calendar",
                      },
                      {
                        text: `Total Volunteers: ${daySlots[date].size}`,
                        icon: `ic:baseline-people`,
                      },
                    ]}
                    actionButton={cardButton(() => {
                      router.push(
                        `/private/events?date=${getStandardDateString(
                          new Date(date)
                        )}`
                      );
                    })}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
      {session.user.role === Role.ADMIN ? (
        <>
          <div className="flex items-center justify-between mt-8">
            <h1 className="text-2xl font-semibold leading-8 font-['Kepler_Std'] mb-3">
              Volunteers List
            </h1>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/private/volunteers")}
            >
              <div className="mt-0.5 text-[#145A5A] font-semibold">
                {t("ver_more")}
              </div>
              <Icon
                icon="lucide:arrow-right"
                width={20}
                height={20}
                style={{ color: "#145A5A" }}
              />
            </div>
          </div>
          <VolunteerTable
            showPagination={false}
            fromVolunteerPage={false}
            fromAttendeePage={false}
            users={users}
          />
        </>
      ) : null}
    </div>
  );
}
