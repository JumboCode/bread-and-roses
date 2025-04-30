"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { getUser, updateUser } from "@api/user/route.client";
import { Role, User, VolunteerDetails } from "@prisma/client";
import RadioButton from "@components/RadioButton";
import useApiThrottle from "../../../../../hooks/useApiThrottle";
import { UserWithVolunteerDetail } from "../../../../types";
import { Autocomplete, TextField } from "@mui/material";
import { Organization } from "@prisma/client";
import { getOrganizations } from "@api/organization/route.client";

export default function EditProfilePage() {
  const router = useRouter();
  const { userId } = useParams();
  const { data: session, status, update } = useSession();

  const [user, setUser] = useState<UserWithVolunteerDetail | null>(null);
  const [volunteerDetails, setVolunteerDetails] =
    useState<VolunteerDetails | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user.id) {
      setLoadError("Not authenticated.");
      return;
    }

    if (session.user.id !== userId) {
      router.replace(`/private/profile/${userId}`);
      return;
    }

    const fetchData = async () => {
      if (!session?.user.id) {
        setLoadError("No user ID found.");
        return;
      }

      try {
        const response = await getUser(session?.user.id);
        if (!response?.data) {
          setLoadError("User not found.");
          return;
        }

        setUser(response.data);
        setVolunteerDetails(response.data.volunteerDetails);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoadError("Failed to load user information.");
      }

      try {
        const res = await getOrganizations();
        if (res?.data) {
          const sorted = [...res.data].sort((a, b) =>
            a.normalizedName.localeCompare(b.normalizedName)
          );
          setOrganizations(sorted);
        }

        const userRes = await getUser(session.user.id);
        setUser(userRes.data);
        setVolunteerDetails(userRes.data.volunteerDetails);
        setOrganizationName(userRes.data.organization?.name || "");
      } catch (err) {
        console.error("Failed to load user/organization info:", err);
        setLoadError("Failed to load user/organization info.");
      }

      setLoading(false);
    };

    fetchData();
  }, [router, session?.user.id, status, userId]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    const trimStrings = <T extends Record<string, unknown>>(obj: T): T => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      ) as T;
    };

    try {
      if (user) {
        await updateUser(
          { ...trimStrings(user), organizationName: organizationName.trim() },
          volunteerDetails ? trimStrings(volunteerDetails) : undefined
        );
        await update();
        router.push(`/private/profile/${userId}`);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    }
  };

  const { fetching: saveLoading, fn: throttledHandleSave } = useApiThrottle({
    fn: handleSave,
  });

  const handleCancel = () => {
    router.push(`/private/profile/${userId}`);
  };

  const isFormValid = () => {
    if (!user) return false;

    const isFirstNameValid = user.firstName.trim() !== "";
    const isLastNameValid = user.lastName.trim() !== "";

    let requiredVolunteerFieldsValid = true;

    if (volunteerDetails) {
      requiredVolunteerFieldsValid = [
        volunteerDetails.ageOver14 !== undefined,
        volunteerDetails.firstTime !== undefined,
        volunteerDetails.address?.trim() !== "",
        volunteerDetails.city?.trim() !== "",
        volunteerDetails.state?.trim() !== "",
        volunteerDetails.zipCode?.trim() !== "",
        volunteerDetails.country?.trim() !== "",
        volunteerDetails.hasLicense !== undefined,
        volunteerDetails.speaksEsp !== undefined,
        volunteerDetails.whyJoin?.trim() !== "",
      ].every(Boolean);
    }

    return isFirstNameValid && isLastNameValid && requiredVolunteerFieldsValid;
  };

  const volunteerDetailKeys: Array<keyof VolunteerDetails> = [
    "ageOver14",
    "firstTime",
    "country",
    "address",
    "city",
    "state",
    "zipCode",
    "hasLicense",
    "speaksEsp",
    "whyJoin",
    "comments",
  ];

  const handleChange = (
    key: keyof User | keyof VolunteerDetails,
    value: string | boolean
  ) => {
    if (volunteerDetailKeys.includes(key as keyof VolunteerDetails)) {
      setVolunteerDetails((prev) => (prev ? { ...prev, [key]: value } : null));
    } else {
      setUser((prev) => (prev ? { ...prev, [key]: value } : null));
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex justify-center items-center text-xl">
        You must be logged in to edit your profile.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-xl text-red-600">{loadError}</p>
        <button
          onClick={() => router.push(`/private/profile/${userId}`)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[calc(100vh-90px)] flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#101828]">Edit Info</h1>
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
            className="px-4 py-2 bg-teal-600 text-white rounded-md font-semibold disabled:opacity-50"
            onClick={throttledHandleSave}
            disabled={!isFormValid() || saveLoading}
          >
            Save
          </button>
        </div>
      </div>

      {/* First Name / Last Name */}
      <div className="flex items-center justify-between">
        <div className="font-bold text-[#344054] w-1/3">
          Name <span className="text-red-500">*</span>
        </div>

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

      {/* Are You Over 14 Field */}
      {session.user.role === Role.VOLUNTEER ? (
        <>
          <div className="flex items-start justify-between">
            <div className="w-1/3">
              <div className="font-bold text-[#344054]">Organization</div>
            </div>
            <div className="flex-grow">
              <Autocomplete
                includeInputInList
                disableClearable
                freeSolo
                options={organizations.map((org) => org.name)}
                inputValue={organizationName}
                onInputChange={(_, value) => setOrganizationName(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      className:
                        "w-full border border-gray-300 rounded-md pt-1 px-2",
                      sx: {
                        fontFamily: "inherit",
                        fontSize: "16px",
                        paddingBottom: "5px !important",
                      },
                      inputProps: {
                        ...params.inputProps,
                        className: "text-sm",
                        style: {
                          fontFamily: "inherit",
                        },
                      },
                    }}
                    variant="standard"
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="w-1/3">
              <div className="font-bold text-[#344054]">
                Are you over 14? <span className="text-[#E61932]">*</span>
              </div>
              <div className="text-sm font-normal text-[#667085]">
                Note: we require volunteers to be over 14 years old to work with
                us.
              </div>
            </div>
            <div className="flex gap-8 items-center flex-grow">
              <RadioButton
                label="Yes"
                checked={volunteerDetails?.ageOver14 === true}
                onChange={() => handleChange("ageOver14", true)}
              />
              <RadioButton
                label="No"
                checked={volunteerDetails?.ageOver14 === false}
                onChange={() => {}}
                disabled
              />
            </div>
          </div>

          {/* First time volunteering? */}
          <div className="flex items-center justify-between">
            <label className="font-bold text-[#344054] w-1/3">
              Is this your first time volunteering with us?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-8 items-center flex-grow">
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
              <div className="font-bold text-[#344054] w-1/3">
                Address <span className="text-red-500">*</span>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Address line"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={volunteerDetails?.address || ""}
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
            <label className="font-bold text-[#344054] w-1/3">
              Do you have a driver&apos;s license?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-8 items-center flex-grow">
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
            <label className="font-bold text-[#344054] w-1/3">
              Do you speak Spanish? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-8 items-center flex-grow">
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
                <label className="font-bold text-[#344054]">
                  Why do you want to volunteer with us?{" "}
                  <span className="text-red-500">*</span>
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
                <div className="font-bold text-[#344054]">
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
        </>
      ) : null}
    </div>
  );
}
