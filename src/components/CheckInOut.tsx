"use client";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";

// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import VisibilityIcon from "@mui/icons-material/Visibility";

import Image from "next/image";
import logo1 from "../../public/logo1.png";

// import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckInOutForm() {
  const [email, setEmail] = useState("");
  const [emailDisplayError, setEmailDisplayError] = useState(false);
  const [activeButton, setActiveButton] = useState<"checkin" | "checkout" | null>(null);

  // use state to keep track of what stage of check-in flow user is on
  const [stage, setStage] = useState<"shifts" | null>(null);

  // mock text for now until backend is implemented
  const emailOptions = [
    "example1@example.com",
    "example2@example.com",
    "example3@example.com",
  ];

  // submit logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  // checking in with shifts stage
  if (stage === "shifts") {
    return (
      <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center min-h-screen w-full">
        <Image src={logo1} alt="Logo" height={173} width={215} className="mb-[24px]"/>
        <div className="p-6 border border-[#D0D5DD] rounded-[20px] shadow-[0px_8px_8px_-4px_#10182808,_0px_20px_24px_-4px_#10182814] flex justify-center items-start pt-6 w-1/2">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center">
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
              <div className="text-[16px] font-bold text-[#344054]">
                Name
                <TextField
                sx={{ width: "100%" }}
                id="outlined-basic"
                label=""
                variant="filled"
                />
              </div>
              
              {/* TODO: implement mapping feature to display shifts */}
              <div className="text-[16px] font-bold text-[#344054]">
                Shift(s) (choose one)
                <div className="flex flex-row gap-[16px] items-center mt-[8px]">
                  <input
                    id="shift"
                    type="radio"
                    className="size-[20px]"
                  />
                  <TextField
                    sx={{ width: "50%" }}
                    id="outlined-basic"
                    label="Start"
                    variant="filled"
                  />
                  <TextField
                    sx={{ width: "50%" }}
                    id="outlined-basic"
                    label="End"
                    variant="filled"
                  />
                </div>
              </div>
            </div>

            <button
              className="bg-[#138D8A] mt-[32px] text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold"
              type="submit"
              // onClick={(e) => {
              //   if (email !== "") {
              //     handleSubmit(e);
              //   }
              // }}
            >
              Confirm Your Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // initial checking in stage
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center min-h-screen w-full">
        <Image src={logo1} alt="Logo" height={173} width={215} className="mb-[24px]"/>
        <div className="p-6 border border-[#D0D5DD] rounded-[20px] shadow-[0px_8px_8px_-4px_#10182808,_0px_20px_24px_-4px_#10182814] flex justify-center items-start pt-6 w-1/2">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center">
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
                            ${activeButton === "checkin" ? "bg-teal-50 border-teal-600 border-[2px]" : "bg-white-50 border-gray-300 border-[1px]"}
                    `}
                    >
                        Check In
                    </button>
                    <button 
                        onClick={() => setActiveButton("checkout")}
                        className={`flex mb-4 text-base justify-center items-center border-[1px] border-gray-300 w-[100px] h-[40px] rounded-lg text-teal-900
                            ${activeButton === "checkout" ? "bg-teal-50 border-teal-600 border-[2px]" : "bg-white-50 border-gray-300 border-[1px]"}
                    `}
                    >
                        Check Out
                    </button>
                </div>
            </div>

            <div className="flex flex-col w-full text-lg font-bold text-[#344054] gap-[8px]">
                Your email
            <TextField
                sx={{ marginBottom: "30px", width: "100%" }}
                id="outlined-basic"
                label=""
                variant="outlined"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                onKeyUp={(e) => {
                    if (e.key === "Enter" && email !== "") {
                    handleSubmit(e);
                    }
                }}
                error={emailDisplayError}
                helperText={emailDisplayError && "Couldn't find your account"}
            />
            </div>

            <button
              className={`${
                email !== ""
                  ? "bg-[#138D8A]"
                  : "bg-[#96E3DA]"
              } text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
              type="submit"
              onClick={(e) => {
                if (email !== "") {
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
