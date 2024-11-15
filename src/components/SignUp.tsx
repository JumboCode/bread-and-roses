"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Image from "next/image";
import logo1 from "../../public/logo1.png";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayError, setDisplayError] = useState(false);

  const CustomInputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton>
          {password != "" &&
            (showPassword ? (
              <VisibilityIcon
                sx={{ color: "#138D8A" }}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <VisibilityOffIcon
                sx={{ color: "#138D8A" }}
                onClick={() => setShowPassword(true)}
              />
            ))}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Image src={logo1} alt="Logo" height={173} width={215} />
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
              Sign up form
            </div>
            <div className="text-[#667085] text-[18px] font-normal mb-[10px]">
              Already have an account? <button>Login in here</button>
            </div>
          </div>
          <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

          <div className="w-full">
            <div>
              Address *
              <TextField
                sx={{ marginBottom: "10px", width: "100%" }}
                id="Address Line"
                label="Address Line"
                variant="outlined"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                error={displayError}
                helperText={displayError && "Couldn't find your account"}
              />
              <div className="flex flex-row items-center gap-[10px] ">
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="City"
                  label="City"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="State"
                  label="State"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
              </div>
              <div className="flex flex-row items-center gap-[10px] ">
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="ZIP code"
                  label="ZIP code"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="State"
                  label="State"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
              </div>
            </div>
          </div>

          <button
            className={`${
              email !== "" && password !== "" ? "bg-[#138D8A]" : "bg-[#96E3DA]"
            } text-white py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
            type="submit"
            onClick={() => {
              if (email !== "" && password !== "") {
                setDisplayError(true);
              }
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
