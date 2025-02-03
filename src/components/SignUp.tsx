"use client";

import { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Image from "next/image";
import logo1 from "../../public/logo1.png";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { addUser } from "@api/user/route.client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Role } from "@prisma/client/edge";
import { IconButton, InputAdornment } from "@mui/material";
import useApiThrottle from "../hooks/useApiThrottle";

export default function SignUp() {
  interface Name {
    first: string;
    last: string;
  }

  interface Address {
    addressLine: string;
    city: string;
    state: string;
    zipCode: string;
  }

  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState<Name>({ first: "", last: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [address, setAddress] = useState<Address>({
    addressLine: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [zipError, setZipError] = useState(false);

  const [isOverAge14, setIsOverAge14] = useState<boolean | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [hasDriverLicense, setHasDriverLicense] = useState<boolean | null>(
    null
  );
  const [speakSpanish, setSpeakSpanish] = useState<boolean | null>(null);
  const [why, setWhy] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);

  const testIfFormComplete = useCallback(() => {
    if (
      name.first !== "" &&
      name.last !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      isOverAge14 !== null &&
      isFirstTime !== null &&
      address.addressLine !== "" &&
      address.city !== "" &&
      address.state !== "" &&
      address.zipCode !== "" &&
      hasDriverLicense !== null &&
      speakSpanish !== null &&
      why !== ""
    ) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [
    name,
    address,
    email,
    password,
    confirmPassword,
    isOverAge14,
    isFirstTime,
    hasDriverLicense,
    speakSpanish,
    why,
  ]);

  useEffect(() => {
    testIfFormComplete();
  }, [
    name.first,
    name.last,
    email,
    password,
    confirmPassword,
    isOverAge14,
    isFirstTime,
    address.addressLine,
    address.city,
    address.state,
    address.zipCode,
    hasDriverLicense,
    speakSpanish,
    why,
    testIfFormComplete,
  ]);

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateZip = () => {
    const zip = address.zipCode.trim();

    const isValid = /^\d+$/.test(zip);

    if (!isValid) {
      setZipError(true);
      return false;
    }

    setZipError(false);
    return true;
  };

  const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isZipValid = validateZip();

    if (!isEmailValid || !isPasswordValid || !isZipValid) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setName({
      first: name.first.trim(),
      last: name.last.trim(),
    });
    setEmail(email.trim());
    setPassword(password.trim());
    setConfirmPassword(confirmPassword.trim());
    setAddress({
      ...address,
      addressLine: address.addressLine.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      zipCode: address.zipCode.trim(),
    });
    setWhy(why.trim());
    setComments(comments.trim());

    if (!validateForm()) {
      return;
    }

    try {
      await addUser(
        {
          firstName: name.first,
          lastName: name.last,
          email: email,
          role: Role.VOLUNTEER,
          password: password,
        },
        {
          ageOver14: isOverAge14 ?? false,
          firstTime: isFirstTime ?? false,
          country: "United States",
          address: address.addressLine,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          hasLicense: hasDriverLicense ?? false,
          speaksEsp: speakSpanish ?? false,
          volunteerType: "",
          hoursWorked: 0,
          whyJoin: why,
          comments: comments,
        }
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const { fn: throttledSubmit } = useApiThrottle({ fn: handleSubmit });

  const PasswordProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton>
          {password !== "" &&
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

  const ConfirmPasswordProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton>
          {confirmPassword !== "" &&
            (showConfirmPassword ? (
              <VisibilityIcon
                sx={{ color: "#138D8A" }}
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <VisibilityOffIcon
                sx={{ color: "#138D8A" }}
                onClick={() => setShowConfirmPassword(true)}
              />
            ))}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <div
      className={`flex flex-col items-center w-full ${success ? "" : "my-10"}`}
    >
      <div
        className={
          "flex flex-col justify-center items-center min-h-screen w-full"
        }
      >
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
                {success ? "Successful" : "Create an account"}
              </div>
              {success ? (
                <div className="w-full text-[#667085] text-[18px] mt-[8px] mb-[24px]">
                  Your account has been created successfully
                </div>
              ) : (
                <div className="w-full text-[#667085] text-[18px] mt-[8px] mb-[24px]">
                  Already have an account?{" "}
                  <button
                    className="text-[#145A5A] font-semibold"
                    onClick={() => router.push("/public/signIn")}
                  >
                    Log in here
                  </button>
                </div>
              )}
            </div>
            <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

            <div className="w-full">
              {success ? (
                <div className="flex items-center justify-center">
                  <Icon
                    icon="fluent:checkmark-circle-12-filled"
                    width="85"
                    height="85"
                    className="text-[#33BDB5] mb-8"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex flex-row font-semibold">
                      Name
                      <div className="text-[red]">*</div>
                    </div>
                    <div className="flex flex-row items-center gap-[10px] ">
                      <TextField
                        sx={{ marginBottom: "10px", width: "100%" }}
                        id="First name"
                        label="First name"
                        variant="outlined"
                        onChange={(e) => {
                          setName({ ...name, first: e.target.value });
                        }}
                      />
                      <TextField
                        sx={{ marginBottom: "10px", width: "100%" }}
                        id="Last name"
                        label="Last name"
                        variant="outlined"
                        onChange={(e) => {
                          setName({ ...name, last: e.target.value });
                        }}
                      />
                    </div>
                    <div className="flex flex-row font-semibold">
                      Email
                      <div className="text-[red]">*</div>
                    </div>
                    <TextField
                      sx={{ marginBottom: "10px", width: "100%" }}
                      id="Email"
                      label="ex: myname@gmail.com"
                      variant="outlined"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      error={emailError !== ""}
                      helperText={emailError}
                    />
                    <div className="flex flex-row font-semibold">
                      Password
                      <div className="text-[red]">*</div>
                    </div>
                    <TextField
                      sx={{ marginBottom: "10px", width: "100%" }}
                      id="Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      slotProps={{
                        input: PasswordProps,
                      }}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      error={passwordError !== ""}
                      helperText={passwordError}
                    />
                    <div className="flex flex-row font-semibold">
                      Confirm Password
                      <div className="text-[red]">*</div>
                    </div>
                    <TextField
                      sx={{ marginBottom: "10px", width: "100%" }}
                      id="Confirm password"
                      variant="outlined"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      slotProps={{
                        input: ConfirmPasswordProps,
                      }}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      error={passwordError !== ""}
                      helperText={passwordError}
                    />
                    <div>
                      <div className="flex flex-row font-semibold">
                        Are you 14 or over?
                        <div className="text-[red]">*</div>
                      </div>
                      <div className="text-[#667085] text-[14px]">
                        Note: we require volunteers to be at least 14 to work
                        with us.
                      </div>
                      <RadioGroup
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "20%",
                          margin: "5px 0 15px 0",
                        }}
                        onChange={(e) =>
                          setIsOverAge14(e.target.value === "true")
                        }
                        aria-labelledby="are you 14 or over"
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
                      <div className="flex flex-row font-semibold">
                        Is this the first time you&apos;re volunteering with us?
                        <div className="text-[red]">*</div>
                      </div>
                      <RadioGroup
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "20%",
                          margin: "5px 0 15px 0",
                        }}
                        onChange={(e) =>
                          setIsFirstTime(e.target.value === "true")
                        }
                        aria-labelledby="first time volunteer"
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
                    <div className="flex flex-row font-semibold">
                      Address
                      <div className="text-[red]">*</div>
                    </div>
                    <TextField
                      sx={{ marginBottom: "10px", width: "100%" }}
                      id="Address"
                      label="Address Line"
                      variant="outlined"
                      value={address.addressLine}
                      onChange={(e) => {
                        setAddress({ ...address, addressLine: e.target.value });
                      }}
                    />
                    <div className="flex flex-row items-center gap-[10px] ">
                      <TextField
                        sx={{ marginBottom: "10px", width: "100%" }}
                        id="City"
                        label="City"
                        value={address.city}
                        onChange={(e) => {
                          setAddress({ ...address, city: e.target.value });
                        }}
                        variant="outlined"
                      />
                      <TextField
                        sx={{ marginBottom: "10px", width: "100%" }}
                        id="State"
                        label="State"
                        variant="outlined"
                        value={address.state}
                        onChange={(e) => {
                          setAddress({ ...address, state: e.target.value });
                        }}
                      />
                    </div>
                    <div className="flex flex-row items-center gap-[10px] ">
                      <TextField
                        sx={{ marginBottom: "10px", width: "100%" }}
                        id="Zip Code"
                        label="Zip Code"
                        variant="outlined"
                        value={address.zipCode}
                        onChange={(e) => {
                          setAddress({ ...address, zipCode: e.target.value });
                        }}
                        error={zipError}
                      />
                      <TextField
                        sx={{ marginBottom: "10px", width: "100%" }}
                        id="Country"
                        variant="outlined"
                        value="United States"
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row font-semibold">
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
                      onChange={(e) =>
                        setHasDriverLicense(e.target.value === "true")
                      }
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
                    <div className="flex flex-row font-semibold">
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
                      onChange={(e) =>
                        setSpeakSpanish(e.target.value === "yes")
                      }
                      aria-labelledby="do you speak Spanish"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </div>
                  <div className="flex flex-row font-semibold">
                    Why do you want to volunteer with us?
                    <div className="text-[red]">*</div>
                  </div>
                  <TextField
                    onChange={(e) => {
                      setWhy(e.target.value);
                    }}
                    sx={{ margin: "5px 0 20px 0", width: "100%" }}
                    id="why"
                    rows={4}
                    multiline
                  />
                  <div>
                    <FormLabel
                      id="Any Questions"
                      sx={{ color: "black", fontWeight: 600 }}
                    >
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
                </>
              )}
            </div>

            {success ? (
              <button
                className="w-full justify-center flex flex-row bg-teal-600 px-4.5 py-2.5 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]"
                onClick={() => router.push("/public/signIn")}
              >
                Back to Log in
              </button>
            ) : (
              <button
                className={`${
                  isFormComplete ? "bg-[#138D8A]" : "bg-[#96E3DA]"
                } text-white py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold`}
                type="submit"
                onClick={async () => {
                  await throttledSubmit();
                }}
                disabled={!isFormComplete}
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
