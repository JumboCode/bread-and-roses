"use client";

import React, { useState, useEffect, FormEvent, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUser, updateUser } from "@api/user/route.client";
import { updatePassword } from "@api/password/route.client";
import { User, VolunteerDetails } from "@prisma/client";

interface UploadAreaProps {
  onFileChange?: (file: File) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed MIME types and max file size (3MB)
  const allowedTypes = [
    "image/svg+xml",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];
  const maxSize = 3 * 1024 * 1024;

  const handleFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Unsupported file.");
      setFile(null);
      return;
    }
    if (file.size > maxSize) {
      setErrorMsg("File exceeds maximum size of 3MB.");
      setFile(null);
      return;
    }
    setErrorMsg("");
    setFile(file);
    if (onFileChange) {
      onFileChange(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const borderColorClass = errorMsg
    ? "border-[#E61932]"
    : "border-[rgba(0,0,0,0.23)]";
  const iconFill = errorMsg ? "#E61932" : "#138D8A";
  const clickToUpload = errorMsg ? "#E61932" : "#138D8A";
  const bottomText = errorMsg
    ? errorMsg
    : "SVG, PNG, JPG or GIF (max. 3MB)";
  const bottomTextColor = errorMsg ? "#E61932" : "#667085";

  return (
    <div
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`w-[762px] h-[112px] px-6 py-4 bg-white rounded-lg flex flex-col justify-start items-center gap-1 inline-flex border ${borderColorClass}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.gif"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="self-stretch h-[80px] flex flex-col justify-start items-center gap-3">
        {/* Icon */}
        <div data-svg-wrapper className="relative">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 16H14C14.55 16 15 15.55 15 15V9.99997H16.59C17.48 9.99997 17.93 8.91997 17.3 8.28997L12.71 3.69997C12.32 3.30997 11.69 3.30997 11.3 3.69997L6.71 8.28997C6.08 8.91997 6.52 9.99997 7.41 9.99997H9V15C9 15.55 9.45 16 10 16ZM6 18H18C18.55 18 19 18.45 19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19C5 18.45 5.45 18 6 18Z"
              fill={iconFill}
            />
          </svg>
        </div>
        {/* Combined clickable upload text */}
        <div className="self-stretch h-[44px] flex flex-col justify-center items-center gap-1 cursor-pointer">
          <div className="text-center text-[14px] leading-[20px] break-words">
            <span className="font-bold" style={{ color: clickToUpload }}>
              Click to upload
            </span>{" "}
            <span className="font-normal" style={{ color: "#667085" }}>
              or drag and drop
            </span>
          </div>
          <div
            className="self-stretch text-center text-[14px] leading-[20px] break-words"
            style={{ color: bottomTextColor }}
          >
            {bottomText}
          </div>
        </div>
      </div>
    </div>
  );
};


type RadioButtonProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, checked, onChange }) => {
  return (
    <div
      className="w-[332px] h-[42px] inline-flex justify-between items-start cursor-pointer"
      onClick={onChange}
    >
      <div className="flex items-center gap-2">
        <div className="w-[42px] h-[42px] flex items-center justify-center">
          {checked ? (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_yes)">
                <path
                  d="M21 16C18.24 16 16 18.24 16 21C16 23.76 18.24 26 21 26C23.76 26 26 23.76 26 21C26 18.24 23.76 16 21 16ZM21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.58 29 13 25.42 13 21C13 16.58 16.58 13 21 13C25.42 13 29 16.58 29 21C29 25.42 25.42 29 21 29Z"
                  fill="#1976D2"
                />
              </g>
              <defs>
                <clipPath id="clip0_yes">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_no)">
                <path
                  d="M21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.58 29 13 25.42 13 21C13 16.58 16.58 13 21 13C25.42 13 29 16.58 29 21C29 25.42 25.42 29 21 29Z"
                  fill="black"
                  fillOpacity="0.6"
                />
              </g>
              <defs>
                <clipPath id="clip0_no">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </div>
        <div className="inline-flex flex-col items-start">
          <div
            className="text-[#344054] text-[16px] font-['Sofia Pro'] font-normal leading-6"
            style={{ wordWrap: "break-word" }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  // const searchParams = useSearchParams();
  
  // 3) Determine which userId to use:
  //    - from query param OR from session user (if editing own profile)
  // const queryUserId = searchParams.get("userId");
  // console.log("queryUserId:", queryUserId);
  // const userId = queryUserId || session?.user.id;

  const [user, setUser] = useState<User | null>(null);
  const [volunteerDetails, setVolunteerDetails] = useState<VolunteerDetails | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // 4) Fetch user once we know userId
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user.id) {
        setLoadError("No user ID found.");
        return;
      }
      try {
        const response = await getUser(session?.user.id);
        // If your API returns { data: User } or something else, adjust accordingly
        if (!response?.data) {
          setLoadError("User not found.");
          return;
        }

        setUser(response.data.user);
        setVolunteerDetails(response.data.volunteerDetails);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoadError("Failed to load user information.");
      }
    };
    fetchData();
  }, [session?.user.id]);

    // 1) Wait for session to load
    if (status === "loading") {
      return (
        <div className="h-screen flex justify-center items-center text-3xl">
          Loading session...
        </div>
      );
    }
  
  // // 2) If no session, show message or redirect
  if (!session) {
    return (
      <div className="h-screen flex justify-center items-center text-xl">
        You must be logged in to edit your profile.
      </div>
    );
  }

  // 5) If there's a load error, show it
  if (loadError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-xl text-red-600">{loadError}</p>
        <button
          onClick={() => router.push("/private/profile")}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Go back
        </button>
      </div>
    );
  }

  // 6) If user is still null, show loading
  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
  }

  // 7) Handle form submission
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    console.log("SAVING");
    // If user entered a new password, handle that first
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      try {
        await updatePassword(user.email, password);
      } catch (err) {
        console.error("Error updating password:", err);
        alert("Failed to update password");
        return;
      }
    }

    // Pass the user   and volunteerDetails as two separate arguments
    try {
      await updateUser(user, volunteerDetails);
      // Navigate back to read-only profile
      router.push(`/private/profile`);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    }
  };

  // 8) Cancel
  const handleCancel = () => {
    router.push(`/private/profile`);
  };

  const volunteerDetailKeys: Array<keyof VolunteerDetails> = [
    'ageOver14',
    'firstTime',
    'country',
    'address',
    'city',
    'state',
    'zipCode',
    'hasLicense',
    'speaksEsp',
    'whyJoin',
    'comments'
  ];

  const handleChange = (
    key: keyof User | keyof VolunteerDetails,
    value: string | boolean
  ) => {
    if (volunteerDetailKeys.includes(key as keyof VolunteerDetails)) {
      setVolunteerDetails(prev => prev ? { ...prev, [key]: value } : null);
    } else {
      setUser(prev => prev ? { ...prev, [key]: value } : null);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="mx-auto w-[1192px] min-h-[994px] p-6 flex flex-col gap-8"
    >
      {/* Header with "Edit Info" and buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-['Sofia Pro'] text-[#101828]">
          Edit Info
        </h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md font-semibold"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {/* First Name / Last Name */}
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <span className="font-semibold w-1/3">Name <span className="text-red-500">*</span></span> 

        {/* Right Side */}
        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          <div className="flex-1">
            
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="First Name"
              value={user.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div className="flex-1">
            
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Last Name"
              value={user.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
        </div>
      </div>
      

      {/* Email */}
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <span className="font-semibold w-1/3">Email <span className="text-red-500">*</span></span> 

        {/* Right Side (same structure as name fields) */}
        <div className="flex-grow">
          
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="ex: myname@gmail.com"
            value={user.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>
      

      {/* Photo placeholder */}
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="w-1/3">
          <div className="text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Your Photo
          </div>
          <div className="text-xs font-normal font-['Sofia Pro'] text-[#667085]">
            This will be displayed on your profile.
          </div>
        </div>
        {/* Right Side (same structure as name fields) */}
        <div className="flex-grow">
          <UploadArea hasError='true'/>
        </div>
      </div>
      
    

      {/* Password + Confirm Password */}
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <span className="font-semibold w-1/3">Password</span> 

        {/* Right Side */}
        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          <div className="flex-1">
            
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex-1">
            
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

    
      {/* Are You Over 14 Field */}
      <div className="flex justify-between items-center w-full">
        <div className="w-[400px]">
          <div className="text-lg font-bold font-['Sofia Pro'] text-[#344054]">
            Are you over 14? <span className="text-[#E61932]">*</span>
          </div>
          <div className="text-sm font-normal font-['Sofia Pro'] text-[#667085]">
            Note: we require volunteers to be over 14 years old to work with us.
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <RadioButton
              label="Yes"
              checked={volunteerDetails?.ageOver14 === true}
              onChange={() => handleChange("ageOver14", true)}
          />
          <RadioButton
            label="No"
            checked={volunteerDetails?.ageOver14 === false}
            onChange={() => handleChange("ageOver14", false)}
          />
        </div>
      </div>
      
      {/* First time volunteering? */}
      <div className="flex items-center justify-between">
        <label className="block mb-1 font-semibold">
          Is this your first time volunteering with us?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-8 items-center ml-4">
          <RadioButton
            label="Yes"
            checked={volunteerDetails?.firstTime === true}
            onChange={() => handleChange("firstTime", true)}
          />
          <RadioButton
            label="No"
            checked={volunteerDetails?.firstTime === false}
            onChange={() => handleChange("firstTime", false)}
          />
        </div>
      </div>

      {/* Address fields */}
      <div>
        {/* Address Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold w-1/3">
            Address <span className="text-red-500">*</span>
          </span>
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Address line"
              className="w-full border border-gray-300 rounded-md p-2"
              value={volunteerDetails?.country || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>

        {/* City and State Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="w-1/3"></span>
          <div className="flex-grow flex gap-4">
            <input
              type="text"
              placeholder="City"
              className="flex-1 border border-gray-300 rounded-md p-2"
              value={volunteerDetails?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              className="flex-1 border border-gray-300 rounded-md p-2"
              value={volunteerDetails?.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>
        </div>

        {/* ZIP and Country Row */}
        <div className="flex items-center justify-between">
          <span className="w-1/3"></span>
          <div className="flex-grow flex gap-4">
            <input
              type="text"
              placeholder="ZIP code"
              className="flex-1 border border-gray-300 rounded-md p-2"
              value={volunteerDetails?.zipCode || ""}
              onChange={(e) => handleChange("zipCode", e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              className="flex-1 border border-gray-300 rounded-md p-2"
              value={volunteerDetails?.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </div>
        </div>
      </div>                


      {/* Driver's license? */}
      <div className="flex items-center justify-between">
        <label className="block mb-1 font-semibold">
          Do you have a driver's license? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-8 items-center ml-4">
          <RadioButton
            label="Yes"
            checked={volunteerDetails?.hasLicense === true}
            onChange={() => handleChange("hasLicense", true)}
          />
          <RadioButton
            label="No"
            checked={volunteerDetails?.hasLicense === false}
            onChange={() => handleChange("hasLicense", false)}
          />
        </div>
      </div>

      {/* Speak Spanish? */}
      <div className="flex items-center justify-between">
        <label className="block mb-1 font-semibold">
          Do you speak Spanish? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-8 items-center ml-4">
          <RadioButton
            label="Yes"
            checked={volunteerDetails?.speaksEsp === true}
            onChange={() => handleChange("speaksEsp", true)}
          />
          <RadioButton
            label="No"
            checked={volunteerDetails?.speaksEsp === false}
            onChange={() => handleChange("speaksEsp", false)}
          />
        </div>
      </div>

      {/* Why volunteer? */}
      <div>
        {/* Why Volunteer Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-1/3">
            <label className="block font-semibold">
              Why do you want to volunteer with us? <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              value={volunteerDetails?.whyJoin || ""}
              onChange={(e) => handleChange("whyJoin", e.target.value)}
            />
          </div>
        </div>

        {/* Comments Row */}
        <div className="flex items-start justify-between">
          <div className="w-1/3">
            <div className="text-lg font-bold font-['Sofia Pro'] text-[#344054]">
              Do you have any other questions or comments?
            </div>
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              value={volunteerDetails?.comments || ""}
              onChange={(e) => handleChange("comments", e.target.value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
