"use client";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import logo1 from "../../public/logo1.png";
import CheckConfirmation from "./CheckConfirmation";
import Autocomplete from "@mui/material/Autocomplete";
import confirmation from "../../public/confirmation.png";
import { TimeSlot } from "@prisma/client";
import { getUsersByDate } from "@api/user/route.client";
import { getTimeSlotsByDate } from "@api/timeSlot/route.client";
import {
  addVolunteerSession,
  updateVolunteerSession,
} from "@api/volunteerSession/route.client";
import { useRouter } from "next/navigation";
import useApiThrottle from "../hooks/useApiThrottle";
import { OrganizationWithUsers, UserWithVolunteerDetail } from "../app/types";
import { getOrganizationsByDate } from "@api/organization/route.client";
import { useTranslation } from "react-i18next";

export default function CheckInOutForm() {
  const router = useRouter();
  const { t } = useTranslation("check");

  const [email, setEmail] = useState("");
  const [activeButton, setActiveButton] = useState<
    "checkin" | "checkout" | null
  >(null);
  const [activeTab, setActiveTab] = useState<"individual" | "group">(
    "individual"
  );

  const [users, setUsers] = useState<UserWithVolunteerDetail[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [checkInOutTime, setCheckInOutTime] = useState<Date | null>(null);
  const [stage, setStage] = useState<"initial" | "shifts" | "confirmation">(
    "initial"
  );
  const [organizations, setOrganizations] = useState<OrganizationWithUsers[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const [userRes, orgRes] = await Promise.all([
          getUsersByDate(today),
          getOrganizationsByDate(today),
        ]);

        if (userRes?.data) {
          const sortedUsers = [...userRes.data].sort((a, b) =>
            a.email.localeCompare(b.email)
          );
          setUsers(sortedUsers);
        }

        if (orgRes?.data) {
          const sortedOrgs = [...orgRes.data].sort((a, b) =>
            a.normalizedName.localeCompare(b.normalizedName)
          );
          setOrganizations(sortedOrgs);
        }
      } catch (err) {
        console.error("Failed to fetch users or organizations:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || activeButton === null) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "individual") {
      const user = users.find((user) => user.email === email);
      if (!user) return;

      if (activeButton === "checkin") {
        try {
          const res = await getTimeSlotsByDate(user.id, today);
          if (res?.data) {
            const filteredSlots = res.data
              .filter((slot: TimeSlot) => slot.organizationId === null) // ✅ Exclude group slots
              .sort(
                (a: TimeSlot, b: TimeSlot) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              );
            setTimeSlots(filteredSlots);
          }
          setStage("shifts");
        } catch (err) {
          console.error("Failed to fetch time slots by date:", err);
        }
      } else {
        try {
          const res = await updateVolunteerSession({ userId: user.id });
          if (res && res.code !== "ALREADY_CHECKED_OUT") {
            const now = new Date();
            setCheckInOutTime(now);
            setStage("confirmation");
          }
        } catch (err) {
          const errorData = JSON.parse((err as Error).message);
          if (errorData.code === "ALREADY_CHECKED_OUT") {
            alert(t("must_check_in_first"));
          } else {
            console.error("Check-out failed:", errorData.message);
            alert(t("checkout_error"));
          }
        }
      }
    } else {
      const org = organizations.find((org) => org.name === email);
      if (!org) {
        console.error("Organization not found.");
        return;
      }

      const allSlots = org.timeSlots ?? [];

      const todaySlots = allSlots
        .filter((slot) => {
          const slotDate = new Date(slot.date);
          slotDate.setHours(0, 0, 0, 0);
          return slotDate.getTime() === today.getTime();
        })
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

      if (activeButton === "checkin") {
        setTimeSlots(todaySlots);
        setStage("shifts");
      } else {
        try {
          const res = await updateVolunteerSession({ organizationId: org.id });
          if (res && res.code !== "ALREADY_CHECKED_OUT") {
            const now = new Date();
            setCheckInOutTime(now);
            setStage("confirmation");
          }
        } catch (err) {
          const errorData = JSON.parse((err as Error).message);
          if (errorData.code === "ALREADY_CHECKED_OUT") {
            alert(t("group_already_checked_out"));
          } else {
            console.error("Group check-out failed:", errorData.message);
            alert(t("checkout_error"));
          }
        }
      }
    }
  };

  const { fetching: continueLoading, fn: throttledHandleContinue } =
    useApiThrottle({
      fn: handleContinue,
    });

  const handleConfirm = async () => {
    const now = new Date();
    const dateWorked = new Date(now);
    dateWorked.setHours(0, 0, 0, 0);

    setCheckInOutTime(now);

    if (!selectedTimeSlot || !email) {
      console.error("Missing time slot or email.");
      return;
    }

    let volunteerSession;

    if (activeTab === "individual") {
      const user = users.find((user) => user.email === email);
      if (!user) {
        console.error("User not found.");
        return;
      }

      volunteerSession = {
        userId: user.id,
        organizationId: null,
        durationHours: null,
        checkInTime: now,
        checkOutTime: null,
        dateWorked,
        timeSlotId: selectedTimeSlot.id,
      };
    } else {
      if (!selectedTimeSlot.organizationId || !selectedTimeSlot.userId) {
        console.error(
          "Missing organizationId or userId in selected time slot."
        );
        return;
      }

      volunteerSession = {
        userId: selectedTimeSlot.userId,
        organizationId: selectedTimeSlot.organizationId,
        durationHours: null,
        checkInTime: now,
        checkOutTime: null,
        dateWorked,
        timeSlotId: selectedTimeSlot.id,
      };
    }

    try {
      await addVolunteerSession(volunteerSession);
      setStage("confirmation");
    } catch (err) {
      if (err instanceof Error) {
        const errorData = JSON.parse(err.message);

        if (errorData.code === "ALREADY_CHECKED_IN") {
          alert(t("already_checked_in"));
        } else {
          console.error("Check-in failed:", errorData.message);
          alert(t("checkin_error"));
        }
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  const { fetching: confirmLoading, fn: throttledHandleConfirm } =
    useApiThrottle({
      fn: handleConfirm,
    });

  const canContinue =
    !continueLoading &&
    email !== "" &&
    activeButton !== null &&
    ((activeTab === "individual" &&
      users.some((user) => user.email === email)) ||
      (activeTab === "group" &&
        organizations.some((org) => org.name === email)));

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
                setTimeSlots([]);
                setStage("initial");
              }}
            >
              <Icon icon={"tabler:arrow-left"} width="20" />
              {t("back")}
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
                  {t("daily_checkin_checkout")}
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
                {t("shift_signup_info")}
                <div className="flex flex-col gap-[20px] text-[16px] font-bold text-[#344054]">
                  {t("shifts_choose_one")}
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
                          label={t("start")}
                          variant="filled"
                          value={format(start)}
                          slotProps={{
                            input: { readOnly: true },
                            inputLabel: { shrink: true },
                          }}
                        />
                        <TextField
                          sx={{ width: "50%", pointerEvents: "none" }}
                          label={t("end")}
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
                  !confirmLoading && selectedTimeSlot !== null
                    ? "bg-[#138D8A] cursor-pointer"
                    : "bg-[#96E3DA] cursor-default"
                } mt-[32px] text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
                type="submit"
                onClick={throttledHandleConfirm}
                disabled={confirmLoading || selectedTimeSlot === null}
              >
                {t("confirm_check_in")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (stage === "confirmation") {
    return (
      <CheckConfirmation
        title={t("check_success_message", {
          action: activeButton === "checkin" ? t("in") : t("out"),
          time: checkInOutTime
            ? checkInOutTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "",
        })}
        captionText={
          activeButton === "checkin"
            ? t("checkin_caption")
            : t("checkout_caption")
        }
        buttonText={t("back_to_first_page")}
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
            {t("back_to_home_page")}
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
                {t("daily_checkin_checkout")}
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
              {t("i_want_to")}
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
                  {t("check_in")}
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
                  {t("check_out")}
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full text-lg font-bold text-[#344054] gap-[16px]">
              {t("select_type")}
              <div className="flex flex-row gap-4 w-full">
                <button
                  onClick={() => setActiveTab("individual")}
                  className={`flex mb-4 text-base justify-center items-center w-[100px] h-[40px] rounded-lg text-teal-900
      ${
        activeTab === "individual"
          ? "bg-teal-50 border-teal-600 border-[2px]"
          : "bg-white-50 border-gray-300 border-[1px]"
      }`}
                >
                  {t("individual")}
                </button>
                <button
                  onClick={() => setActiveTab("group")}
                  className={`flex mb-4 text-base justify-center items-center w-[100px] h-[40px] rounded-lg text-teal-900
      ${
        activeTab === "group"
          ? "bg-teal-50 border-teal-600 border-[2px]"
          : "bg-white-50 border-gray-300 border-[1px]"
      }`}
                >
                  {t("group")}
                </button>
              </div>
              {activeTab === "individual" ? (
                <>
                  <div>{t("your_email")}</div>
                  <Autocomplete
                    includeInputInList
                    disableClearable
                    freeSolo
                    options={users.map((user) => user.email)}
                    filterOptions={(options, { inputValue }) =>
                      options
                        .filter((option) =>
                          option
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        )
                        .slice(0, 5)
                    }
                    inputValue={email}
                    onInputChange={(_, value) => {
                      setEmail(value);
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ marginBottom: "30px", width: "100%" }}
                        id="individual-email"
                        variant="outlined"
                        onKeyUp={(e) => {
                          if (e.key === "Enter" && email !== "") {
                            handleSubmit(e);
                          }
                        }}
                      />
                    )}
                  />
                </>
              ) : (
                <>
                  <div>{t("organization_name")}</div>
                  <Autocomplete
                    includeInputInList
                    disableClearable
                    freeSolo
                    options={organizations.map((org) => org.name)}
                    filterOptions={(options, { inputValue }) =>
                      options
                        .filter((option) =>
                          option
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        )
                        .slice(0, 5)
                    }
                    inputValue={email}
                    onInputChange={(_, value) => {
                      setEmail(value);
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ marginBottom: "30px", width: "100%" }}
                        id="group-org"
                        variant="outlined"
                        onKeyUp={(e) => {
                          if (e.key === "Enter" && email !== "") {
                            handleSubmit(e);
                          }
                        }}
                      />
                    )}
                  />
                </>
              )}
            </div>
            <button
              className={`${
                canContinue
                  ? "bg-[#138D8A] cursor-pointer"
                  : "bg-[#96E3DA] cursor-default"
              } text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
              type="submit"
              disabled={!canContinue}
              onClick={(e) => {
                throttledHandleContinue(e);
              }}
            >
              {t("continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
