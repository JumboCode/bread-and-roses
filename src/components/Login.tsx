"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Image from "next/image"
import logo1 from "../../public/logo1.png"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayError, setDisplayError] = useState(false);

  const CustomInputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton>
          {password != "" && (showPassword ? (
            <VisibilityIcon onClick={() => setShowPassword(false)} />
          ) : (
            <VisibilityOffIcon onClick={() => setShowPassword(true)} />
          ))}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <div className="flex flex-col items-center" style={{ minHeight: "100vh" }}>
      <Image src={logo1} alt="Logo" />
      <div
        className="p-6"
        style={{
          border: "1px solid #D0D5DD",
          borderRadius: "20px",
          boxShadow: "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "24px",
          width: "50%",
        }}
      >
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
              Welcome back!
            </div>
            <div
              style={{
                color: "#667085",
                fontSize: "18px",
                fontWeight: 400,
                marginBottom: "10px",
              }}
            >
              Please enter your details
            </div>
          </div>
          <hr
            style={{
              width: "100%",
              borderTop: "1px solid #D0D5DD",
              marginBottom: "20px",
            }}
          />

          <TextField
            sx={{ marginBottom: "10px", width: "100%" }}
            id="outlined-basic"
            label="Email address"
            variant="outlined"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            error={displayError}
            helperText={displayError && "Couldn't find your account"}
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
              if (showPassword) {
                setPassword(e.target.value);
              }
            }}
            error={displayError}
            helperText={displayError && "Wrong Password"}
          />
          <div
            style={{ marginBottom: "20px" }}
            className="w-full flex flex-row justify-between"
          >
            <FormControlLabel
              control={<Checkbox ria-label="Checkbox demo" />}
              label="Remember me"
              sx={{ color: "#667085" }}
            />

            <button
              style={{
                marginLeft: "40px",
                color: "#145A5A",
                fontWeight: 500,
              }}
            >
              Forget Password
            </button>
          </div>

          <button
            style={{
              backgroundColor: !(email != "" && password != "")
                ? "#96E3DA"
                : "#138D8A",
              color: "white",
              padding: "10px 18px 10px 18px",
              borderRadius: "8px",
              width: "100%",
              textAlign: "center",
              fontWeight: "600",
            }}
            type="submit"
            onClick={()=> {
              if (email != "" && password != "") {
                setDisplayError(true);
              }
            }}
          >
            Sign In
          </button>

          <div
            className="w-full"
            style={{ color: "#667085", fontSize: "14px", marginTop: "25px" }}
          >
            Don't have an account?{" "}
            <span style={{ color: "#145A5A", fontWeight: 600 }}>
              Sign up here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
