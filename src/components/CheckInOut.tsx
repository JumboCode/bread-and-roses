"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import logo1 from "../../public/logo1.png";
import CheckConfirmation from "./CheckConfirmation";
import Autocomplete from "@mui/material/Autocomplete";
import confirmation from "../../public/confirmation.png";

export default function CheckInOutForm() {
  const [email, setEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emailDisplayError, setEmailDisplayError] = useState(false);
  const [activeButton, setActiveButton] = useState<
    "checkin" | "checkout" | null
  >(null);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  // use state to keep track of what stage of check-in flow user is on
  const [stage, setStage] = useState<"initial" | "shifts" | "confirmation">(
    "initial"
  );

  // store shifts in an array (sample data for now)
  const shifts = [1, 2];

  // mock text for now until backend is implemented
  const emailOptions = [
    "johnnytan@example.com",
    "wonkim@example.com",
    "antran@example.com",
  ];

  // submit logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  // checking in with shifts stage
  if (stage === "shifts") {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col justify-center items-center min-h-screen w-full my-[32px]">
          <div className="w-1/2">
            <button
              className="flex flex-row gap-[8px] text-[16px] text-[#145A5A] font-bold"
              type="button"
              onClick={() => setStage("initial")}
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
                  Friday, January 31, 2025
                </div>
              </div>
              <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

              <div className="flex flex-col w-full text-lg font-bold text-[#344054] gap-[32px]">
                Here is your shift signup information:
                <div className="flex flex-col gap-[20px] text-[16px] font-bold text-[#344054]">
                  Shift(s) (choose one)
                  {shifts.map((shift, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-[16px] items-center mt-[8px]"
                    >
                      <input
                        id={`shift-${index}`}
                        value={shift}
                        type="radio"
                        className="size-[20px] cursor-pointer"
                        checked={selectedShift === shift}
                        onChange={() => setSelectedShift(shift)}
                      />
                      <TextField
                        sx={{ width: "50%", pointerEvents: "none" }}
                        id="outlined-basic"
                        label="Start"
                        variant="filled"
                        value="10:00 AM"
                        slotProps={{
                          input: { readOnly: true },
                          inputLabel: { shrink: true },
                        }}
                      />
                      <TextField
                        sx={{ width: "50%", pointerEvents: "none" }}
                        id="outlined-basic"
                        label="End"
                        variant="filled"
                        value="4:00 PM"
                        slotProps={{
                          input: { readOnly: true },
                          inputLabel: { shrink: true },
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="bg-[#138D8A] mt-[32px] text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold"
                type="submit"
                onClick={() => {
                  setStage("confirmation");
                }}
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
      // can replace text of modal if user hasn't signed up for shift yet
      <CheckConfirmation
        title="Hooray! You have checked in at 10:00:39 AM."
        captionText="Do not forget to check out before you leave!"
        buttonText="Back to First Page"
        image={confirmation}
        onClick={() => {
          setEmail("");
          setActiveButton(null);
          setSelectedShift(null);
          setStage("initial");
        }}
      />
    );
  }

  // initial checking in stage
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center min-h-screen w-full">
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
                Friday, January 31, 2025
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
                options={emailOptions}
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
                    error={emailDisplayError}
                    helperText={
                      emailDisplayError && "Couldn't find your account"
                    }
                  />
                )}
              />
            </div>

            <button
              className={`${
                email !== "" && activeButton !== null
                  ? "bg-[#138D8A] cursor-pointer"
                  : "bg-[#96E3DA] cursor-default"
              } text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
              type="submit"
              onClick={(e) => {
                if (email !== "" && activeButton !== null) {
                  handleSubmit(e);
                  setStage("shifts");
                }
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
