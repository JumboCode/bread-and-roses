"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Image from "next/image";
import logo1 from "../../public/logo1.png";

export default function SignUp() {
  interface Address {
    addressLine: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayError, setDisplayError] = useState(false);
  const [address, setAddress] = useState<Address>({addressLine: "",
    city: "",
    state: "",
    zipCode: "",
    county: ""});
  const [hasDriverLicense, setHasDriverLicense] = useState<boolean | null>(
    null
  );
  const [speakSpanish, setSpeakSpanish] = useState<boolean | null>(
    null
  );
  const [why, setWhy] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setAddress({...address, county: event.target.value})
  };

  const handleChangeDriverLicense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasDriverLicense(Boolean((event.target as HTMLInputElement).value));
  };

    const handleChangeSpeakSpanish = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setSpeakSpanish(Boolean((event.target as HTMLInputElement).value));
    };


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
            <div className="w-full text-[#667085] text-[14px] mt-[8px] mb-[24px]">
              Already have an account?{" "}
              <button className="text-[#145A5A] font-semibold">
                Log in here
              </button>
            </div>
          </div>
          <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

          <div className="w-full">
            <div>
              <div className="w-full text-[#667085] text-[16px]">Name *</div>
              <div className="flex flex-row items-center gap-[10px] ">
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="First name"
                  label="First name"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="Last name"
                  label="Last name"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
              </div>
              Email *
              <TextField
                sx={{ marginBottom: "10px", width: "100%" }}
                id="Email"
                label="ex: myname@gmail.com"
                variant="outlined"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                error={displayError}
                helperText={displayError && "Couldn't find your account"}
              />
              Password *
              <TextField
                sx={{ marginBottom: "10px", width: "100%" }}
                id="Password"
                variant="outlined"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                error={displayError}
                helperText={displayError && "Couldn't find your account"}
              />
              Confirm password *
              <TextField
                sx={{ marginBottom: "10px", width: "100%" }}
                id="Confirm password"
                variant="outlined"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                error={displayError}
                helperText={displayError && "Couldn't find your account"}
              />
              <div className="flex flex-row">
                Address
                <div className="text-[red]">*</div>
              </div>
              <TextField
                sx={{ marginBottom: "10px", width: "100%" }}
                id="Address"
                value={address.addressLine}
                onChange={(e) => {
                  setAddress({ ...address, addressLine: e.target.value });
                }}
                placeholder="Address Line"
                variant="outlined"
                error={displayError}
                helperText={displayError && "Couldn't find your account"}
              />
              <div className="flex flex-row items-center gap-[10px] ">
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="City"
                  value={address.city}
                  onChange={(e) => {
                    setAddress({ ...address, city: e.target.value });
                  }}
                  variant="outlined"
                  placeholder="City"
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="State"
                  placeholder="State"
                  variant="outlined"
                  value={address.state}
                  onChange={(e) => {
                    setAddress({ ...address, state: e.target.value });
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
              </div>
              <div className="flex flex-row items-center gap-[10px] ">
                <TextField
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="ZIP code"
                  placeholder="ZIP code"
                  variant="outlined"
                  value={address.zipCode}
                  onChange={(e) => {
                    setAddress({ ...address, zipCode: e.target.value });
                  }}
                  error={displayError}
                  helperText={displayError && "Couldn't find your account"}
                />
                <Select
                  labelId="select-county"
                  sx={{ marginBottom: "10px", width: "100%" }}
                  id="county"
                  value={address.county}
                  placeholder="ZIP code"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </div>
            </div>
            <div>
              <div className="flex flex-row">
                Do you have a driver&apos;s license?
                <div className="text-[red]">*</div>
              </div>
              <RadioGroup
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20%",
                  margin: "5px 0 15px 0",
                }}
                onChange={handleChangeDriverLicense}
                aria-labelledby="do you have a driver's license"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </div>
            <div>
              <div className="flex flex-row">
                Do you speak Spanish?
                <div className="text-[red]">*</div>
              </div>
              <RadioGroup
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20%",
                  margin: "5px 0 15px 0",
                }}
                onChange={handleChangeSpeakSpanish}
                aria-labelledby="do you speak Spanish"
                name="radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </div>
            <div className="flex flex-row">
              Why do you want to volunteer with us?
              <div className="text-[red]">*</div>
            </div>
            <TextField
              onChange={(e) => setWhy(e.target.value)}
              sx={{ margin: "5px 0 20px 0", width: "100%" }}
              id="why"
              rows={4}
              multiline
            />
            <div>
              <FormLabel id="Any Questions" sx={{ color: "black" }}>
                Do you have any other questions/comments?
              </FormLabel>
              <TextField
                sx={{ margin: "5px 0 20px 0", width: "100%" }}
                onChange={(e) => setComments(e.target.value)}
                id="questions/comments"
                rows={4}
                multiline
              />
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
