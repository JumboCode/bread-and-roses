"use client";

import React, { useState } from "react";
import Image from "next/image";
import TextField from "@mui/material/TextField";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = () => {
    // include more logic here like having @ and stuff
    // somehow check if email address is in backend? or include some conditional to only move on if found
    if (email === "") {
      setError("Please enter a valid email address.");
    } else {
      setError("");
      setStep(2);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Image src={"/logo1.png"} alt="Logo" height={173} width={215} />
      <div className="w-[592px] h-[297px] p-6 bg-white rounded-lg shadow border-1 border-[#e4e7ec] flex-col justify-start items-start gap-8 inline-flex items-center">
        <div>
          <div className="w-[544px] h-[44px] text-[#9A0F28] text-center font-semibold text-[36px] leading-[44px] font-['Kepler Std']">
            Forgot password
          </div>
          <div className="w-[544px] h-[28px] text-gray-500 text-center font-normal text-[18px] leading-[28px] font-['Sofia Pro']">
            Enter your email to receive the 4 digits code.
          </div>
          <div className="pt-2 w-[544px] border-b border-1 border-[#F2F4F7]">
            {" "}
          </div>
        </div>

        {step === 1 && (
          <>
            <div>
              <TextField
                sx={{ marginBottom: "10px", width: "544px", height: "56px" }}
                id="outlined-basic"
                label="Email address"
                variant="outlined"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                onClick={handleEmailSubmit}
                className="w-[544px] justify-center flex flex-row bg-teal-600 px-4.5 py-2.5 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]"
              >
                Continue
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div></div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
