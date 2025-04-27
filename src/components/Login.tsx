"use client";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Image from "next/image";
import logo1 from "../../public/logo1.png";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useApiThrottle from "../hooks/useApiThrottle";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailDisplayError, setEmailDisplayError] = useState(false);
  const [passwordDisplayError, setPasswordDisplayError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Change to your desired redirect path
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const remember = rememberMe ? "on" : "off";

    const res = await signIn("credentials", {
      email,
      password,
      remember,
      redirect: false,
    });

    if (res?.error) {
      if (res?.error == "Invalid password") {
        setPasswordDisplayError(true);
        setTimeout(() => setPasswordDisplayError(false), 3000);
      } else if (res?.error == "Invalid user") {
        setEmailDisplayError(true);
        setTimeout(() => setEmailDisplayError(false), 3000);
      }
    } else {
      window.location.href = "/";
    }
  };

  const { fetching: submitLoading, fn: throttledHandleSubmit } = useApiThrottle(
    {
      fn: handleSubmit,
    }
  );

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
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center min-h-screen w-full">
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
                Welcome!
              </div>
              <div className="text-[#667085] text-[18px] font-normal mb-[10px]">
                Please enter your details
              </div>
            </div>
            <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

            <TextField
              sx={{ marginBottom: "10px", width: "100%" }}
              id="outlined-basic"
              label="Email address"
              variant="outlined"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onKeyUp={(e) => {
                if (
                  e.key === "Enter" &&
                  email !== "" &&
                  password !== "" &&
                  !submitLoading
                ) {
                  throttledHandleSubmit(e);
                }
              }}
              error={emailDisplayError}
              helperText={emailDisplayError && "Couldn't find your account"}
            />
            <TextField
              sx={{ width: "100%" }}
              id="outlined-basic"
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              slotProps={{
                input: CustomInputProps,
              }}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!showPassword) {
                  e.preventDefault();
                }
              }}
              onKeyUp={(e) => {
                if (
                  e.key === "Enter" &&
                  email !== "" &&
                  password !== "" &&
                  !submitLoading
                ) {
                  throttledHandleSubmit(e);
                }
              }}
              error={passwordDisplayError}
              helperText={passwordDisplayError && "Wrong Password"}
            />
            <div className="mb-[20px] w-full flex flex-row justify-between">
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => setRememberMe(e.target.checked)}
                    checked={rememberMe}
                    ria-label="Checkbox demo"
                  />
                }
                label="Remember me"
                sx={{ color: "#667085" }}
              />

              <button
                className="ml-[40px] text-[#145A5A] font-medium"
                onClick={() => router.push("/public/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button
              className={`${
                !submitLoading && email !== "" && password !== ""
                  ? "bg-[#138D8A]"
                  : "bg-[#96E3DA]"
              } text-white py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
              type="submit"
              onClick={(e) => {
                if (email !== "" && password !== "" && !submitLoading) {
                  throttledHandleSubmit(e);
                }
              }}
            >
              Sign In
            </button>

            <div className="w-full text-[#667085] text-[14px] mt-[25px]">
              Don&apos;t have an account?{" "}
              <button
                className="text-[#145A5A] font-semibold"
                onClick={() => router.push("/public/signUp")}
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
