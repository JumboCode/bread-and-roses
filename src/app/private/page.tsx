"use client";

import { useSession } from "next-auth/react";
import StatsCard from "@components/StatsCard";
import EventCard from "@components/EventCard";
import VolunteerTable from "@components/VolunteerTable";
import { Role, Event } from "@prisma/client";
import React from "react";
import { getUsersByRole } from "@api/user/route.client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { UserWithVolunteerDetail } from "../types";
import { fetchEvent } from "../api/event/route.client";

export default function HomePage() {
  const router = useRouter();

  const { data: session } = useSession();
  const [users, setUsers] = React.useState<UserWithVolunteerDetail[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, eventsResponse] = await Promise.all([
          getUsersByRole(Role.VOLUNTEER),
          fetchEvent(),
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

  return (
    <div>
      <div>
        <h1 className="text-4xl font-semibold	leading-10 font-['Kepler_Std']">
          Thanks for checking in, {session.user.firstName} 👋
        </h1>
        <h1 className="text-lg mt-3 font-normal leading-7 font-serif text-slate-500">
          What&apos;s the next event you want to join?
        </h1>
      </div>

      <div className="flex flex-nowrap gap-x-7 pt-8">
        {session.user.role === Role.ADMIN && (
          <StatsCard
            heading="Total volunteers"
            value={!loading ? users.length : "..."}
            icon="pepicons-pencil:people"
            date="October 5th, 2024" // NOTE: Date will soon be moved
          />
        )}
        <StatsCard
          heading={
            session.user.role === Role.ADMIN
              ? "Total volunteer hours"
              : "Personal volunteer hours"
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
          date="October 5th, 2024" // NOTE: Date will soon be moved
        />
        <StatsCard
          heading={
            session.user.role === Role.ADMIN
              ? "Total events"
              : "Events attended"
          }
          value={
            !loading
              ? session.user.role === Role.ADMIN
                ? events.length
                : 9999 // @TODO: Replace with actual user's events in the future
              : "..."
          }
          icon="mdi:calendar-outline"
          date="December 11th, 2024" // NOTE: Date will soon be moved
        />
      </div>

      <div>
        <div className="flex items-center justify-between mt-8">
          <h1 className="text-2xl font-semibold leading-8 font-['Kepler_Std']">
            Upcoming events
          </h1>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/private/events")}
          >
            <div className="mt-0.5 text-[#145A5A] font-semibold">See all</div>
            <Icon
              icon="lucide:arrow-right"
              width={20}
              height={20}
              style={{ color: "#145A5A" }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-7">
          <div className="mt-3">
            <EventCard
              title="Dewick Community Meal"
              start={new Date("December 10, 2024 11:20:00")}
              end={new Date("December 17, 2024 13:20:00")}
              address="25 Latin Way, Medford, MA 02155"
              volunteers={10}
              maxVolunteers={15}
            />
          </div>
          <div className="mt-3">
            <EventCard
              title="Carmichael Grab & Go Meal"
              start={new Date("December 10, 2024 12:30:00")}
              end={new Date("December 17, 2024 14:00:00")}
              address="200 Packard Ave, Medford, MA 02155"
              volunteers={15}
              maxVolunteers={15}
            />
          </div>
          <div className="mt-3">
            <EventCard
              title="Hodgedon Food-on-the-run"
              start={new Date("December 10, 2024 14:20:00")}
              end={new Date("December 17, 2024 14:30:00")}
              address="103 Talbot Ave. Somerville, MA 02144"
              volunteers={10}
              maxVolunteers={15}
            />
          </div>
          {session.user.role === Role.VOLUNTEER ? (
            <>
              <div className="mt-3">
                <EventCard
                  title="Dewick Community Meal"
                  start={new Date("December 10, 2024 11:20:00")}
                  end={new Date("December 17, 2024 13:20:00")}
                  address="25 Latin Way, Medford, MA 02155"
                  volunteers={10}
                  maxVolunteers={15}
                />
              </div>
              <div className="mt-3">
                <EventCard
                  title="Carmichael Grab & Go Meal"
                  start={new Date("December 10, 2024 12:30:00")}
                  end={new Date("December 17, 2024 14:00:00")}
                  address="200 Packard Ave, Medford, MA 02155"
                  volunteers={15}
                  maxVolunteers={15}
                />
              </div>
              <div className="mt-3">
                <EventCard
                  title="Hodgedon Food-on-the-run"
                  start={new Date("December 10, 2024 14:20:00")}
                  end={new Date("December 17, 2024 14:30:00")}
                  address="103 Talbot Ave. Somerville, MA 02144"
                  volunteers={10}
                  maxVolunteers={15}
                />
              </div>
            </>
          ) : null}
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
              <div className="mt-0.5 text-[#145A5A] font-semibold">See all</div>
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
            users={users}
          />
        </>
      ) : null}
    </div>
  );
}
