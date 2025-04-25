"use client";

import { useSession } from "next-auth/react";
import StatsCard from "@components/StatsCard";
import EventCard from "@components/EventCard";
import VolunteerTable from "@components/VolunteerTable";
import { Role, Event, TimeSlot, TimeSlotStatus } from "@prisma/client";
import React, { useEffect } from "react";
import { getUsersByRole } from "@api/user/route.client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { UserWithVolunteerDetail } from "../types";
import { getAllEvents } from "../api/event/route.client";
import { useTranslation } from "react-i18next";
import { getTimeSlots, getTimeSlotsByStatus } from "@api/timeSlot/route.client";
import { getStandardDateString, sortedReadableTimeSlots } from "../utils";

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

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (session?.user.role === Role.VOLUNTEER) {
        const res = await getTimeSlots(session?.user.id as string);
        setTimeSlots(res.data);
      } else if (session?.user.role === Role.ADMIN) {
        const res = await getTimeSlotsByStatus(TimeSlotStatus.AVAILABLE);
        res.data.forEach((timeSlot: TimeSlot) => {
          const date = new Date(timeSlot.startTime).toLocaleDateString(
            "en-US",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );

          setDaySlots((prev) => {
            if (!prev[date]) {
              prev[date] = new Set();
            }
            prev[date].add(timeSlot.id);
            return { ...prev };
          });
        });
      }
    };

    fetchTimeSlots();
  }, []);

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
          ======= Stats updated by:{" "}
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
          value={
            !loading
              ? session.user.role === Role.ADMIN && users
                ? users.reduce(
                    (sum, user) =>
                      sum + (user.volunteerDetails?.hoursWorked || 0),
                    0
                  )
                : session.user.volunteerDetails?.hoursWorked || 0
              : "..."
          }
          icon="tabler:clock-check"
        />
        <StatsCard
          heading={
            session.user.role === Role.ADMIN
              ? "Total events"
              : t("events_attended", { ns: "home" })
          }
          value={
            !loading
              ? session.user.role === Role.ADMIN
                ? events.length
                : 9999 // @TODO: Replace with actual user's events in the future
              : "..."
          }
          icon="mdi:calendar-outline"
        />
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
        <div className="flex gap-x-7">
          {session.user.role === Role.VOLUNTEER ? (
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
