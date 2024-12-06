"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [codeError, setCodeError] = useState(false);
  const [codeBackendError, setCodeBackendError] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [counter, setCounter] = React.useState(30);

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailFound = true; // Placeholder, replace with backend logic
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
    } else if (!emailFound) {
      setError("Couldn't find your account");
    } else {
      setError("");
      setStep(2);
      setCounter(30);
    }
  };

  const handlePasswordSubmit = () => {
    if (
      confirmPassword !== newPassword ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      setStep(4);
    }
  };

  const handleCodeSubmit = () => {
    const isCodeCorrect = true; // Placeholder, replace with backend logic
    if (code.some((digit) => digit === "")) {
      setCodeError(true);
      setCodeBackendError(false);
    } else if (!isCodeCorrect) {
      setCodeBackendError(true);
      setCodeError(false);
    } else {
      setCodeError(false);
      setCodeBackendError(false);
      setStep(3);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d$/.test(value) && value !== "") return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (codeError || codeBackendError) {
      setCodeError(false);
      setCodeBackendError(false);
    }

    if (value && index < 3 && inputs.current[index + 1]) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (
      e.key === "Backspace" &&
      !code[index] &&
      index > 0 &&
      inputs.current[index - 1]
    ) {
      (inputs.current[index - 1] as HTMLInputElement)?.focus();
    }
    if (e.key === "Enter") {
      handleCodeSubmit();
    }
  };

  const handleKeyDownSpace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Space") {
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (counter > 0) {
      timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [counter]);

  const CustomInputProps = (inputType: "newPassword" | "confirmPassword") => {
    const toggleVisibility = () => {
      if (inputType === "newPassword") {
        setShowNewPassword((prev) => !prev);
      } else if (inputType === "confirmPassword") {
        setShowConfirmPassword((prev) => !prev);
      }
    };

    return {
      endAdornment: (
        <InputAdornment position="end">
          {inputType === "newPassword" && newPassword !== "" && (
            <IconButton>
              {showNewPassword ? (
                <VisibilityIcon
                  sx={{ color: "#138D8A" }}
                  onClick={toggleVisibility}
                />
              ) : (
                <VisibilityOffIcon
                  sx={{ color: "#138D8A" }}
                  onClick={toggleVisibility}
                />
              )}
            </IconButton>
          )}
          {inputType === "confirmPassword" && confirmPassword !== "" && (
            <IconButton>
              {showConfirmPassword ? (
                <VisibilityIcon
                  sx={{ color: "#138D8A" }}
                  onClick={toggleVisibility}
                />
              ) : (
                <VisibilityOffIcon
                  sx={{ color: "#138D8A" }}
                  onClick={toggleVisibility}
                />
              )}
            </IconButton>
          )}
        </InputAdornment>
      ),
    };
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center min-h-screen w-full max-w-xl">
        <div className="w-full">
          {step === 2 && (
            <button
              className="flex justify-start items-center text-teal-800 font-inter font-semibold px-2 gap-2"
              onClick={() => setStep(1)}
            >
              <Icon
                icon="tabler:arrow-left"
                width="20"
                height="20"
                className="text-teal-800"
              />
              Back
            </button>
          )}
        </div>
        <div className="max-w-56">
          <Image
            src={"/logo1.png"}
            alt="Logo"
            layout="responsive"
            width={215}
            height={173}
            className=""
          />
        </div>
        <div className="w-full h-auto p-6 bg-white rounded-lg shadow-xl border-1 border-[#e4e7ec] flex-col justify-start inline-flex items-center">
          <div className="text-[#9A0F28] text-center font-semibold text-2xl font-['Kepler Std'] ">
            {step <= 2
              ? "Forgot password"
              : step === 3
              ? "New password"
              : step === 4
              ? "Successful"
              : "Enter Code"}
          </div>

          {step === 1 && (
            <>
              <div className="w-full text-gray-500 text-center font-normal text-lg font-['Sofia Pro']">
                Enter your email to receive the 4 digits code.
              </div>
              <div className="pt-2 w-full border-b border-1 border-[#E4E7EC]">
                {" "}
              </div>
              <div className="w-full py-8">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Email address"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleEmailSubmit();
                    }
                  }}
                  error={Boolean(error)}
                  helperText={error}
                />
              </div>
              <div className="w-full">
                <button
                  onClick={handleEmailSubmit}
                  className="w-full justify-center flex flex-row bg-teal-600 px-4.5 py-2.5 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]"
                >
                  Continue
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="w-full text-gray-500 text-center font-normal text-[18px] leading-[28px] font-['Sofia Pro']">
                Enter your 4 digits code that you received on your email.
              </div>
              <div className="pt-2 w-full border-b border-1 border-[#E4E7EC]">
                {" "}
              </div>
              <div className="flex flex-col gap-8 py-8">
                <div className="flex space-x-2">
                  {code.map((value, index) => (
                    <TextField
                      key={index}
                      value={value}
                      onChange={(e) =>
                        handleCodeChange(e.target.value.slice(-1), index)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      inputRef={(el) => (inputs.current[index] = el)}
                      error={codeError}
                      className={`w-[50px] h-[56px] text-center text-lg ${
                        codeError ? "border-rose-600" : "border-gray-300"
                      } rounded-lg`}
                      inputProps={{ maxLength: 1, className: "text-center" }}
                    />
                  ))}
                </div>
                <div className="flex justify-center text-rose-600 text-center font-normal text-[18px] leading-[28px] font-['Sofia Pro']">
                  {String(Math.floor(counter / 60)).padStart(2, "0")}:
                  {String(counter % 60).padStart(2, "0")}
                </div>
              </div>
              <div className="w-full">
                <div className="w-full">
                  <button
                    onClick={handleCodeSubmit}
                    className="w-full justify-center flex flex-row bg-teal-600 px-4.5 py-2.5 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <div className="text-[#667085] text-[18px] font-normal mb-[10px]">
                  Set the new password for your account.
                </div>
              </div>
              <hr className="w-full border-t border-[#E4E7EC] mb-[20px]" />

              <TextField
                sx={{ marginBottom: "10px", width: "100%" }}
                id="outlined-basic"
                type={showNewPassword ? "text" : "password"}
                onKeyDown={handleKeyDownSpace}
                label="New Password"
                variant="outlined"
                slotProps={{
                  input: CustomInputProps("newPassword"),
                }}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (!showNewPassword) {
                    e.preventDefault();
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit();
                  }
                }}
                error={passwordError}
              />
              <TextField
                sx={{ marginBottom: "10px", width: "100%" }}
                id="outlined-basic"
                type={showConfirmPassword ? "text" : "password"}
                onKeyDown={handleKeyDownSpace}
                label="Confirm New Password"
                variant="outlined"
                slotProps={{
                  input: CustomInputProps("confirmPassword"),
                }}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit();
                  }
                }}
                error={passwordError}
                helperText={passwordError && "Passwords do not match"}
              />

              <button
                onClick={handlePasswordSubmit}
                className="w-full justify-center flex flex-row bg-teal-600 px-4.5 py-2.5 text-white rounded-lg place-items-center text-[14px] font-semibold"
              >
                Continue
              </button>
            </>
          )}
          {step === 4 && (
            <>
              <div>
                <div className="text-[#667085] text-[18px] font-normal mb-[10px]">
                  Your password has been reset successfully.
                </div>
              </div>
              <hr className="w-full border-t border-[#E4E7EC]" />

              <Icon
                icon="fluent:checkmark-circle-12-filled"
                width="85"
                height="85"
                className="text-teal-800 my-8"
              />

              <button
                className="w-full justify-center flex flex-row bg-teal-600 px-4.5 py-2.5 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]"
                onClick={() => router.push("/public/login")}
              >
                Back to Log in
              </button>
            </>
          )}
        </div>
        {step === 2 && (
          <div className="mt-4 text-gray-500 text-center text-sm font-['Sofia Pro']">
            Didn&#39;t receive a code?
            <button className="px-1 text-teal-600 font-semibold font-['Sofia Pro']">
              Resend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
