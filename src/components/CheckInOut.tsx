"use client";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import logo1 from "../../public/logo1.png";
import CheckConfirmation from "./CheckConfirmation";
import Autocomplete from "@mui/material/Autocomplete";
import confirmation from "../../public/confirmation.png";
import { TimeSlot, User } from "@prisma/client";
import { getUsersByDate } from "@api/user/route.client";
import { getTimeSlotsByDate } from "@api/timeSlot/route.client";
import {
  addVolunteerSession,
  updateVolunteerSession,
} from "@api/volunteerSession/route.client";
import { useRouter } from "next/navigation";

export default function CheckInOutForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [activeButton, setActiveButton] = useState<
    "checkin" | "checkout" | null
  >(null);
  const [users, setUsers] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [checkInOutTime, setCheckInOutTime] = useState<Date | null>(null);
  const [stage, setStage] = useState<"initial" | "shifts" | "confirmation">(
    "initial"
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const today = new Date();
        const res = await getUsersByDate(today);
        if (res && res.data) {
          const sortedUsers = [...res.data].sort((a, b) =>
            a.email.localeCompare(b.email)
          );
          setUsers(sortedUsers);
        }
      } catch (err) {
        console.error("Failed to fetch users by date:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleContinue = async (e: React.FormEvent) => {
    if (
      email !== "" &&
      activeButton !== null &&
      users.find((user) => user.email === email)
    ) {
      e.preventDefault();
      const user = users.find((user) => user.email === email);

      if (activeButton === "checkin") {
        try {
          const today = new Date();

          if (user) {
            const res = await getTimeSlotsByDate(user.id, today);

            if (res && res.data) {
              const sortedSlots = [...res.data].sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              );
              setTimeSlots(sortedSlots);
            }
          }

          setStage("shifts");
        } catch (err) {
          console.error("Failed to fetch time slots by date:", err);
        }
      } else {
        try {
          if (user) {
            const res = await updateVolunteerSession(user.id);
            if (res && res.code && res.code !== "ALREADY_CHECKED_OUT") {
              const now = new Date();
              setCheckInOutTime(now);
              setStage("confirmation");
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            const errorData = JSON.parse(err.message);

            if (errorData.code === "ALREADY_CHECKED_OUT") {
              alert(
                "You have already checked out and must check in before checking out again."
              );
            } else {
              console.error("Check-out failed:", errorData.message);
              alert("There was an error during check-out. Please try again.");
            }
          } else {
            console.error("Unexpected error:", err);
          }
        }
      }
    }
  };

  const handleConfirm = async () => {
    const now = new Date();
    const dateWorked = new Date(now);
    dateWorked.setHours(0, 0, 0, 0);

    setCheckInOutTime(now);

    if (!selectedTimeSlot || !email) {
      console.error("Missing time slot or email.");
      return;
    }

    const user = users.find((user) => user.email === email);
    if (!user) {
      console.error("User not found.");
      return;
    }

    const volunteerSession = {
      userId: user.id,
      durationHours: null,
      checkInTime: now,
      checkOutTime: null,
      dateWorked: dateWorked,
      timeSlotId: selectedTimeSlot.id,
    };

    try {
      await addVolunteerSession(volunteerSession);
      setStage("confirmation");
    } catch (err) {
      if (err instanceof Error) {
        const errorData = JSON.parse(err.message);

        if (errorData.code === "ALREADY_CHECKED_IN") {
          alert(
            "You have already checked in and must check out before checking in again."
          );
        } else {
          console.error("Check-in failed:", errorData.message);
          alert("There was an error during check-in. Please try again.");
        }
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  if (stage === "shifts") {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col justify-center items-center min-h-screen w-full my-[32px]">
          <div className="w-1/2">
            <button
              className="flex flex-row gap-[8px] text-[16px] text-[#145A5A] font-bold"
              type="button"
              onClick={() => {
                setSelectedTimeSlot(null);
                setStage("initial");
              }}
            >
              <Icon icon={"tabler:arrow-left"} width="20" />
              Back
            </button>
          </div>
          <Image
            src={logo1}
            alt="Logo"
            height={173}
            width={215}
            className="mb-[24px]"
          />
          <div className="p-6 border border-[#D0D5DD] rounded-[20px] shadow-[0px_8px_8px_-4px_#10182808,_0px_20px_24px_-4px_#10182814] flex justify-center items-start pt-6 w-1/2">
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col items-center text-center">
                <div
                  style={{
                    color: "#9A0F28",
                    fontSize: "36px",
                    fontWeight: 600,
                    fontFamily: "Kepler Std",
                  }}
                >
                  Daily Check-In/Check-Out
                </div>
                <div className="text-[#667085] text-[16px] font-normal mb-[10px]">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

              <div className="flex flex-col w-full text-lg font-bold text-[#344054] gap-[32px]">
                Here is your shift signup information:
                <div className="flex flex-col gap-[20px] text-[16px] font-bold text-[#344054]">
                  Shift(s) (choose one)
                  {timeSlots.map((slot, index) => {
                    const start = new Date(slot.startTime);
                    const end = new Date(slot.endTime);

                    const format = (date: Date) =>
                      date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });

                    const isAvailable = slot.status === "AVAILABLE";

                    return (
                      <div
                        key={slot.id}
                        className={`flex flex-row gap-[16px] items-center mt-[8px] ${
                          !isAvailable ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <input
                          id={`slot-${index}`}
                          type="radio"
                          className="size-[20px] cursor-pointer"
                          checked={selectedTimeSlot?.id === slot.id}
                          onChange={() => setSelectedTimeSlot(slot)}
                          disabled={!isAvailable}
                        />
                        <TextField
                          sx={{ width: "50%", pointerEvents: "none" }}
                          label="Start"
                          variant="filled"
                          value={format(start)}
                          slotProps={{
                            input: { readOnly: true },
                            inputLabel: { shrink: true },
                          }}
                        />
                        <TextField
                          sx={{ width: "50%", pointerEvents: "none" }}
                          label="End"
                          variant="filled"
                          value={format(end)}
                          slotProps={{
                            input: { readOnly: true },
                            inputLabel: { shrink: true },
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                className={`${
                  selectedTimeSlot !== null
                    ? "bg-[#138D8A] cursor-pointer"
                    : "bg-[#96E3DA] cursor-default"
                } mt-[32px] text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
                type="submit"
                onClick={handleConfirm}
                disabled={selectedTimeSlot === null}
              >
                Confirm Your Check-In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (stage === "confirmation") {
    return (
      <CheckConfirmation
        title={`Hooray! You have checked ${
          activeButton === "checkin" ? "in" : "out"
        } at ${
          checkInOutTime
            ? checkInOutTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : ""
        }.`}
        captionText={
          activeButton === "checkin"
            ? "Do not forget to check out before you leave!"
            : "Thank you for your hard work today! We look forward to seeing you again soon."
        }
        buttonText="Back to First Page"
        image={confirmation}
        onClick={() => {
          setEmail("");
          setActiveButton(null);
          setSelectedTimeSlot(null);
          setCheckInOutTime(null);
          setStage("initial");
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center min-h-screen w-full">
        <div className="w-1/2">
          <button
            className="flex flex-row gap-[8px] text-[16px] text-[#145A5A] font-bold"
            type="button"
            onClick={() => {
              router.push("/private");
            }}
          >
            <Icon icon={"tabler:arrow-left"} width="20" />
            Back to Home Page
          </button>
        </div>
        <Image
          src={logo1}
          alt="Logo"
          height={173}
          width={215}
          className="mb-[24px]"
        />
        <div className="p-6 border border-[#D0D5DD] rounded-[20px] shadow-[0px_8px_8px_-4px_#10182808,_0px_20px_24px_-4px_#10182814] flex justify-center items-start pt-6 w-1/2">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center text-center">
              <div
                style={{
                  color: "#9A0F28",
                  fontSize: "36px",
                  fontWeight: 600,
                  fontFamily: "Kepler Std",
                }}
              >
                Daily Check-In/Check-Out
              </div>
              <div className="text-[#667085] text-[16px] font-normal mb-[10px]">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

            <div className="flex flex-col w-full text-lg font-bold text-[#344054] gap-[8px]">
              I want to
              <div className="flex flex-row gap-4 w-full">
                <button
                  onClick={() => setActiveButton("checkin")}
                  className={`flex mb-4 text-base justify-center items-center w-[100px] h-[40px] rounded-lg text-teal-900
                            ${
                              activeButton === "checkin"
                                ? "bg-teal-50 border-teal-600 border-[2px]"
                                : "bg-white-50 border-gray-300 border-[1px]"
                            }
                    `}
                >
                  Check In
                </button>
                <button
                  onClick={() => setActiveButton("checkout")}
                  className={`flex mb-4 text-base justify-center items-center border-[1px] border-gray-300 w-[100px] h-[40px] rounded-lg text-teal-900
                            ${
                              activeButton === "checkout"
                                ? "bg-teal-50 border-teal-600 border-[2px]"
                                : "bg-white-50 border-gray-300 border-[1px]"
                            }
                    `}
                >
                  Check Out
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full text-lg font-bold text-[#344054] gap-[8px]">
              Your email
              <Autocomplete
                includeInputInList
                disableClearable
                freeSolo
                options={users.map((user) => user.email)}
                inputValue={email}
                onInputChange={(_, value) => {
                  setEmail(value);
                }}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ marginBottom: "30px", width: "100%" }}
                    id="outlined-basic"
                    label=""
                    variant="outlined"
                    value={email}
                    onKeyUp={(e) => {
                      if (e.key === "Enter" && email !== "") {
                        handleSubmit(e);
                      }
                    }}
                  />
                )}
              />
            </div>

            <button
              className={`${
                email !== "" &&
                activeButton !== null &&
                users.find((user) => user.email === email)
                  ? "bg-[#138D8A] cursor-pointer"
                  : "bg-[#96E3DA] cursor-default"
              } text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
              type="submit"
              onClick={(e) => {
                handleContinue(e);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
