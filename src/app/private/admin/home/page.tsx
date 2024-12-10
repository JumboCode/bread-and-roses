"use client";

import StatsCard from "@components/StatsCard";
import TopHeader from "@components/TopHeader";
import EventCard from "@components/EventCard";
import VolunteerTable from "@components/VolunteerTable/VolunteerTable";

const AdminHomePage = () => {
  const start1 = new Date("December 10, 2024 11:20:00");
  const end1 = new Date("December 17, 2024 13:20:00");
  const start2 = new Date("December 10, 2024 12:30:00");
  const end2 = new Date("December 17, 2024 14:00:00");
  const start3 = new Date("December 10, 2024 14:20:00");
  const end3 = new Date("December 17, 2024 14:30:00");

  return (
    <div>
      <TopHeader userType="admin"></TopHeader>

      <div className="pt-24	pl-7 pr-7">
        <div>
          <h1 className="text-4xl font-semibold	leading-10 font-serif">
            Thanks for checking in, An 👋
          </h1>
          <h1 className="text-lg font-normal leading-7 font-serif text-slate-500">
            What's the next event you want to join?
          </h1>
        </div>

        <div className="flex flex-nowrap gap-x-7 pt-8">
          <div>
            <StatsCard
              heading="Total Volunteers"
              value="50"
              icon=""
              date="October 5th, 2024"
            />
          </div>
          <StatsCard
            heading="Total Volunteer Hours"
            value="200"
            icon=""
            date="October 5th, 2024"
          />
          <div>
            <StatsCard
              heading="Total Events"
              value="10"
              icon=""
              date="October 5th, 2024"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold leading-8 font-serif pt-8">
            Upcoming Events
          </h1>
          <div>
            <div className="flex flex-nowrap gap-x-7">
              <EventCard
                title="Dewick Community Meal"
                start={start1}
                end={end1}
                address="25 Latin Way, Medford, MA 02155"
                volunteers={10}
                maxVolunteers={15}
              />
              <EventCard
                title="Carmichael Grab & Go Meal"
                start={start2}
                end={end2}
                address="200 Packard Ave, Medford, MA 02155"
                volunteers={15}
                maxVolunteers={15}
              />

              <EventCard
                title="Hodgedon Food-on-the-run"
                start={start3}
                end={end3}
                address="103 Talbot Ave. Somerville, MA 02144"
                volunteers={10}
                maxVolunteers={15}
              />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold leading-8 font-serif pt-8">
          Volunteers List
        </h1>
        <div>
          <VolunteerTable></VolunteerTable>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
