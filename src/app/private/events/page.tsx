"use client";

import React from "react";
import "react-day-picker/style.css";
import { Calendar } from "@components/Calendar";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { Button, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { Role, TimeSlot, TimeSlotStatus, User } from "@prisma/client";
import {
  addTimeSlot,
  deleteTimeSlot,
  getTimeSlotsByDate,
} from "@api/timeSlot/route.client";
import VolunteerTable from "@components/VolunteerTable";
import { getUsersByDate } from "@api/user/route.client";
import { useSearchParams } from "next/navigation";
import { getStandardDate } from "../../utils";
import { getCustomDay } from "@api/customDay/route.client";
import useApiThrottle from "../../../hooks/useApiThrottle";

export default function EventsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const [pageLoading, setPageLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );
  const [timeSlots, setTimeSlots] = React.useState([
    { start: "", end: "", submitted: false },
  ]);
  const [individuals, setIndividuals] = React.useState<User[]>([]);
  const [groups, setGroups] = React.useState<User[]>([]);
  const [page, setPage] = React.useState(0);

  const [customDayHours, setCustomDayHours] = React.useState<{
    start: string;
    end: string;
  }>({ start: "10:00", end: "18:00" });
  const [customDayTitle, setCustomDayTitle] = React.useState("");
  const [customDayDescription, setCustomDayDescription] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"Individuals" | "Groups">(
    "Individuals"
  );

  const handleAddTimeSlot = () => {
    setTimeSlots((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].submitted = true;
      return [...updated, { start: "", end: "", submitted: false }];
    });
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const doesOverlap = (newStart: string, newEnd: string, index: number) => {
    const newStartMinutes = toMinutes(newStart);
    const newEndMinutes = toMinutes(newEnd);

    return timeSlots.some((slot, i) => {
      if (i === index || !slot.submitted) return false;

      const start = toMinutes(slot.start);
      const end = toMinutes(slot.end);

      return newStartMinutes < end && newEndMinutes > start;
    });
  };

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const lastSlot = timeSlots[timeSlots.length - 1];

  const isOutOfBounds = (time: string) => {
    if (!time) return false;
    const minutes = toMinutes(time);
    const lowerBound = toMinutes(customDayHours.start);
    const upperBound = toMinutes(customDayHours.end);
    return minutes < lowerBound || minutes > upperBound;
  };

  const isCurrentSlotValid =
    lastSlot.start &&
    lastSlot.end &&
    lastSlot.start < lastSlot.end &&
    !doesOverlap(lastSlot.start, lastSlot.end, timeSlots.length - 1) &&
    !isOutOfBounds(lastSlot.start) &&
    !isOutOfBounds(lastSlot.end);

  const hasSubmittedSlot = timeSlots.some((slot) => slot.submitted);

  const isPastOrToday = (date?: Date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate <= today;
  };

  const isSameSlot = (
    a: { start: string; end: string },
    b: { start: string; end: string }
  ) => a.start === b.start && a.end === b.end;

  const handleConfirm = async () => {
    if (!session?.user.id || !selectedDate) return;

    const slotsToSubmit = timeSlots.filter(
      (slot) => slot.start && slot.end && slot.submitted
    );
    const formattedSubmitted = slotsToSubmit.map((slot) => ({
      start: slot.start,
      end: slot.end,
    }));

    try {
      const result = await getTimeSlotsByDate(session.user.id, selectedDate);
      const existingSlots: TimeSlot[] = result.data;

      const formattedExisting = existingSlots.map((slot) => ({
        start: new Date(slot.startTime).toTimeString().slice(0, 5),
        end: new Date(slot.endTime).toTimeString().slice(0, 5),
      }));

      const newSlots = formattedSubmitted.filter(
        (slot) =>
          !formattedExisting.some((existing) => isSameSlot(slot, existing))
      );

      for (const slot of newSlots) {
        const start = new Date(`${selectedDate.toDateString()} ${slot.start}`);
        const end = new Date(`${selectedDate.toDateString()} ${slot.end}`);
        const durationHours =
          (end.getTime() - start.getTime()) / 1000 / 60 / 60;

        await addTimeSlot({
          userId: session.user.id,
          organizationId: null,
          startTime: start,
          endTime: end,
          durationHours,
          date: selectedDate,
          approved: true,
          status: TimeSlotStatus.AVAILABLE,
          numVolunteers: 1,
        });
      }

      const deletedSlots = formattedExisting.filter(
        (slot) =>
          !formattedSubmitted.some((submitted) => isSameSlot(slot, submitted))
      );

      for (const slot of deletedSlots) {
        await deleteTimeSlot(
          session.user.id,
          new Date(`${selectedDate.toDateString()} ${slot.start}`),
          new Date(`${selectedDate.toDateString()} ${slot.end}`)
        );
      }

      setPage(1);
    } catch (error) {
      console.error("Failed to sync time slots:", error);
    }
  };

  const { fetching: confirmLoading, fn: throttledHandleConfirm } =
    useApiThrottle({
      fn: handleConfirm,
    });

  React.useEffect(() => {
    if (date !== null) {
      setSelectedDate(getStandardDate(date));
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
    }
  }, [date]);

  React.useEffect(() => {
    const fetchAllData = async () => {
      if (!session?.user.id || !selectedDate) return;

      try {
        await Promise.all([
          (async () => {
            if (session.user.role === Role.ADMIN) {
              const result = await getUsersByDate(selectedDate);
              const users = result.data;

              const individuals = users
                .map((user: User & { timeSlots: TimeSlot[] }) => ({
                  ...user,
                  timeSlots: user.timeSlots.filter(
                    (slot) => !slot.organizationId
                  ),
                }))
                .filter(
                  (user: User & { timeSlots: TimeSlot[] }) =>
                    user.timeSlots.length > 0
                );

              const groups = users
                .map((user: User & { timeSlots: TimeSlot[] }) => ({
                  ...user,
                  timeSlots: user.timeSlots.filter(
                    (slot) => slot.organizationId
                  ),
                }))
                .filter(
                  (user: User & { timeSlots: TimeSlot[] }) =>
                    user.timeSlots.length > 0
                );

              setIndividuals(individuals);
              setGroups(groups);
            } else {
              const result = await getTimeSlotsByDate(
                session.user.id,
                selectedDate
              );
              const slots = result.data;

              const formatted: {
                start: string;
                end: string;
                submitted: boolean;
              }[] = slots.map((slot: TimeSlot) => ({
                start: new Date(slot.startTime).toTimeString().slice(0, 5),
                end: new Date(slot.endTime).toTimeString().slice(0, 5),
                submitted: true,
              }));

              formatted.sort((a, b) => a.start.localeCompare(b.start));

              setTimeSlots([
                ...formatted,
                { start: "", end: "", submitted: false },
              ]);
            }
          })(),
          (async () => {
            const result = await getCustomDay(selectedDate);
            const customDay = result.data;

            if (customDay) {
              const start = new Date(customDay.startTime)
                .toTimeString()
                .slice(0, 5);
              const end = new Date(customDay.endTime)
                .toTimeString()
                .slice(0, 5);
              setCustomDayHours({ start, end });
              setCustomDayTitle(customDay.title ?? "");
              setCustomDayDescription(customDay.description ?? "");
            } else {
              setCustomDayHours({ start: "10:00", end: "18:00" });
              setCustomDayTitle("");
              setCustomDayDescription("");
            }
          })(),
        ]);
      } catch (error) {
        console.error("Error fetching event page data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchAllData();
  }, [session?.user.id, selectedDate, session?.user.role]);

  if (pageLoading || !session) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold flex flex-row items-center gap-x-[12px] mb-10">
        <Icon icon="uil:calender" width="44" height="44" />
        Events
      </div>
      <div className="relative text-center w-full flex flex-row gap-x-[24px] pb-1">
        <div className="flex-2 flex flex-col">
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            previousDisabled={false}
            onDateChange={() => setPage(0)}
          />
        </div>
        <div className="flex-1 flex flex-col text-start gap-y-[32px]">
          {session?.user.role === Role.VOLUNTEER ? (
            <div className="px-5 py-5 bg-white rounded-lg shadow border border-[#e4e7ec]">
              {page === 0 ? (
                <>
                  <div className="flex items-start gap-[32px]">
                    <Image
                      src="/event-card-placeholder.png"
                      alt="event image"
                      width={175}
                      height={175}
                    />
                    <div className="flex flex-col gap-5 mt-2 w-full">
                      <div>
                        <div className="font-bold text-lg text-[#101828]">
                          {customDayTitle === ""
                            ? !isPastOrToday(selectedDate)
                              ? `Sign up for your volunteering time! We are open from${" "}
                        ${formatTime(customDayHours.start)} -${" "}
                        ${formatTime(customDayHours.end)}.`
                              : "Your Volunteer Hours"
                            : customDayTitle}
                        </div>
                        {customDayDescription !== "" && (
                          <div className="text-sm text-[#344054] pt-1">
                            {customDayDescription}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon
                          icon="material-symbols:timelapse-outline"
                          className="text-[#344054]"
                          width="20"
                          height="20"
                        />
                        <div className="text-sm text-[#344054]">
                          {formattedDate
                            ? !isPastOrToday(selectedDate)
                              ? `Choose Your Time (${formattedDate})`
                              : formattedDate
                            : "Choose Your Time"}
                        </div>
                      </div>
                      <div
                        className={!isPastOrToday(selectedDate) ? "mb-6" : ""}
                      >
                        <div className="flex flex-col gap-4 flex-grow">
                          {isPastOrToday(selectedDate) &&
                          timeSlots.length === 1 ? (
                            <div>No time slots!</div>
                          ) : (
                            timeSlots.map((slot, index) => (
                              <div key={index}>
                                {slot.submitted ? (
                                  <div className="border border-[#D0D5DD] rounded-lg flex p-2 justify-between">
                                    <div className="flex gap-4">
                                      <Icon
                                        icon="material-symbols:calendar-today"
                                        className="text-[#344054]"
                                        width="20"
                                        height="20"
                                      />
                                      <div>
                                        {formatTime(slot.start)} -{" "}
                                        {formatTime(slot.end)}
                                      </div>
                                    </div>
                                    {!isPastOrToday(selectedDate) ? (
                                      <Icon
                                        icon="ic:baseline-clear"
                                        className="text-[#344054] cursor-pointer"
                                        width="20"
                                        height="20"
                                        onClick={() => {
                                          const newSlots = [...timeSlots];
                                          newSlots.splice(index, 1);
                                          setTimeSlots(newSlots);
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                ) : !isPastOrToday(selectedDate) ? (
                                  <div className="flex flex-row justify-between">
                                    <div className="flex items-center gap-4">
                                      <TextField
                                        type="time"
                                        variant="outlined"
                                        size="small"
                                        label="Start Time"
                                        value={slot.start}
                                        onChange={(e) => {
                                          const newSlots = [...timeSlots];
                                          newSlots[index].start =
                                            e.target.value;
                                          setTimeSlots(newSlots);
                                        }}
                                        error={Boolean(
                                          (slot.start &&
                                            slot.end &&
                                            slot.start > slot.end) ||
                                            (slot.start &&
                                              slot.end &&
                                              doesOverlap(
                                                slot.start,
                                                slot.end,
                                                index
                                              )) ||
                                            isOutOfBounds(slot.start)
                                        )}
                                        slotProps={{
                                          inputLabel: { shrink: true },
                                          htmlInput: {
                                            max: slot.end || "23:59",
                                          },
                                        }}
                                      />
                                      <TextField
                                        type="time"
                                        variant="outlined"
                                        size="small"
                                        label="End Time"
                                        value={slot.end}
                                        onChange={(e) => {
                                          const newSlots = [...timeSlots];
                                          newSlots[index].end = e.target.value;
                                          setTimeSlots(newSlots);
                                        }}
                                        error={Boolean(
                                          (slot.start &&
                                            slot.end &&
                                            slot.end < slot.start) ||
                                            (slot.start &&
                                              slot.end &&
                                              doesOverlap(
                                                slot.start,
                                                slot.end,
                                                index
                                              )) ||
                                            isOutOfBounds(slot.end)
                                        )}
                                        slotProps={{
                                          inputLabel: { shrink: true },
                                          htmlInput: {
                                            min: slot.start || "00:00",
                                          },
                                        }}
                                      />
                                    </div>
                                    <Button
                                      onClick={handleAddTimeSlot}
                                      disabled={!isCurrentSlotValid}
                                      className="self-end"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        border:
                                          "1px solid var(--Grey-300, #D0D5DD)",
                                        color: "#145A5A",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        textTransform: "none",
                                        fontFamily: "inherit",
                                        gap: "8px",
                                        borderRadius: "8px",
                                        paddingInline: "14px",
                                        paddingBlock: "8px",
                                      }}
                                    >
                                      <Icon
                                        icon="material-symbols:add-circle-rounded"
                                        width="20"
                                        height="20"
                                      />
                                      <div>Add This Time Slot</div>
                                    </Button>
                                  </div>
                                ) : null}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-6 mb-2">
                  <div className="font-bold text-2xl text-[#9A0F28] font-['Kepler_Std']">
                    You have signed up! We look forward to seeing you!
                  </div>
                  <Image
                    src="/confirmation.png"
                    alt="Confirmation"
                    width={400}
                    height={350}
                    objectFit="contain"
                    quality={100}
                  />
                  <div className="font-bold text-lg text-[#344054]">
                    Below is your time slot information. You can check it out on
                    the homepage.
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="material-symbols:calendar-month"
                      className="text-[#138D8A]"
                      width="20"
                      height="20"
                    />
                    <div className="text-[#344054]">{formattedDate}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-shrink-0">
                      <Icon
                        icon="material-symbols:timelapse-outline"
                        className="text-[#138D8A]"
                        width="24"
                        height="24"
                      />
                    </div>
                    <div className="text-[#344054] text-center">
                      {timeSlots
                        .filter((slot) => slot.submitted)
                        .map(
                          (slot) =>
                            `${formatTime(slot.start)} - ${formatTime(
                              slot.end
                            )}`
                        )
                        .join(" / ")}
                    </div>
                  </div>
                </div>
              )}
              {!isPastOrToday(selectedDate) ? (
                <Button
                  sx={{
                    backgroundColor: "#138D8A",
                    textTransform: "none",
                    fontFamily: "inherit",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "14px",
                    paddingBlock: "10px",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "8px",
                    marginTop: "16px",
                    "&.Mui-disabled": {
                      color: "white",
                      opacity: 0.5,
                    },
                  }}
                  onClick={
                    page === 0 ? throttledHandleConfirm : () => setPage(0)
                  }
                  disabled={confirmLoading || (page === 0 && !hasSubmittedSlot)}
                >
                  {page === 0 ? "Confirm" : "Close"}
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="px-5 py-5 bg-white rounded-lg shadow border border-[#e4e7ec]">
              <div className="flex items-start gap-[32px]">
                <Image
                  src="/event-card-placeholder.png"
                  alt="event image"
                  width={175}
                  height={175}
                />
                <div className="flex flex-col gap-5 mt-2 w-full">
                  <div>
                    <div className="font-bold text-4xl font-['Kepler_Std']">
                      {customDayTitle === ""
                        ? "Time Slot Registrations"
                        : customDayTitle}
                    </div>
                    {customDayDescription !== "" && (
                      <div className="text-sm text-[#344054] pt-1">
                        {customDayDescription}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="material-symbols:timelapse-outline"
                      className="text-[#344054]"
                      width="20"
                      height="20"
                    />
                    <div className="text-sm text-[#344054]">
                      Opening Time: {formatTime(customDayHours.start)} -{" "}
                      {formatTime(customDayHours.end)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-[20px]">
                    <Icon
                      icon="mdi:people"
                      className="text-[#344054]"
                      width="20"
                      height="20"
                    />
                    <div className="text-sm text-[#344054]">
                      Total Individual Signups: {individuals.length}{" "}
                      {individuals.length === 1 ? "volunteer" : "volunteers"}
                    </div>
                  </div>
                </div>
              </div>
              <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />
              <div>
                <div className="flex gap-2 pb-4">
                  {["Individuals", "Groups"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setActiveTab(tab as "Individuals" | "Groups")
                      }
                      className={`px-3 py-1 text-sm font-medium flex items-center gap-1 border-b-2 transition-colors duration-200 ${
                        activeTab === tab
                          ? "text-teal-600 border-teal-600"
                          : "text-gray-700 border-transparent hover:text-teal-600 hover:border-teal-300"
                      }`}
                    >
                      <Icon
                        icon={
                          tab === "Individuals" ? "mdi:person" : "mdi:people"
                        }
                        width="20"
                        height="20"
                      />
                      <div>{tab}</div>
                    </button>
                  ))}
                </div>
                {activeTab === "Individuals" ? (
                  individuals.length === 0 ? (
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
                        It seems like no individuals have signed up!
                      </div>
                    </div>
                  ) : (
                    <VolunteerTable
                      showPagination
                      fromVolunteerPage={false}
                      fromAttendeePage
                      users={individuals}
                    />
                  )
                ) : groups.length === 0 ? (
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
                      It seems like no groups have signed up!
                    </div>
                  </div>
                ) : (
                  <VolunteerTable
                    showPagination
                    fromVolunteerPage={false}
                    fromAttendeePage
                    users={groups}
                    showOrganizationName
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
