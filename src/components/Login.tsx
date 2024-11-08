// import Divider from "@mui/material/Divider";
"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Image from "next/image"
import logo1 from "../../public/logo1.png"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(true);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

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
          />
          <TextField
            sx={{ width: "100%" }}
            id="outlined-basic"
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="outlined"
            // onChange={someChangeHandler}
            slotProps={{ input: <div>???</div> }}
            // slotProps={{ label: labelProps }}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <IconButton
            //         aria-label="toggle password visibility"
            //         onClick={handleClickShowPassword}
            //         onMouseDown={handleMouseDownPassword}
            //       >
            //         {showPassword ? <Visibility /> : <VisibilityOff />}
            //       </IconButton>
            //     </InputAdornment>
            //   ),
            // }}
          />
          <div
            style={{ marginBottom: "20px" }}
            className="w-full flex flex-row justify-between"
          >
            <FormControlLabel
              control={<Checkbox ria-label="Checkbox demo" />}
              label="Remember me"
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
              backgroundColor: !isReadyToSubmit ? "#96E3DA" : "#138D8A",
              color: "white",
              padding: "10px 18px 10px 18px",
              borderRadius: "8px",
              width: "100%",
              textAlign: "center",
              fontWeight: "600",
            }}
            type="submit"
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
