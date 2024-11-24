"use client";

import ExampleButton from "@components/ExampleButton";
import CreateUserForm from "@components/createUserForm";
import { useState } from "react";
import { getUser, deleteUser, updateUser } from "@api/user/route.client";
import { User, VolunteerDetails } from "@prisma/client";

export default function ExampleCallingUserRoutes() {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [volunteerDetails, setVolunteerDetails] =
    useState<VolunteerDetails | null>(null);

  const getUserButton = async () => {
    try {
      console.log("userID:", userID);
      const response = await getUser(userID);
      const fetchedUser = response.data.user;
      const fetchedVD = response.data.volunteerDetails;

      console.log(fetchedUser.firstName);
      console.log(fetchedVD);

      setUser(fetchedUser);
      setVolunteerDetails(fetchedVD);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const deleteUserButton = async () => {
    try {
      await deleteUser(userID);
      setUser(null);
      console.log("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateUserButton = async () => {
    try {
      console.log(user);
      console.log(volunteerDetails);
      if (!user || !volunteerDetails) {
        throw new Error("User data is incomplete");
      }

      const updatedUser = {
        ...user,
        firstName: "Justin",
      };

      const updatedVD = {
        ...volunteerDetails,
        country: "Mexico",
      };
      console.log(updatedVD);

      const response = await updateUser(updatedUser, updatedVD);
      setUser(response.data.user);
      setVolunteerDetails(response.data.volunteerDetails);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <CreateUserForm setUserID={setUserID} />
      <div>
        <ExampleButton buttonText="Fetch User" callBack={getUserButton} />
        {user ? (
          <div>
            <li>
              {user.firstName} {user.lastName} -{" "}
              {volunteerDetails?.country || "Country not set"}
            </li>
            {user.email}
          </div>
        ) : (
          <div>No user...</div>
        )}
      </div>
      <ExampleButton buttonText="Update User" callBack={updateUserButton} />
      <ExampleButton buttonText="Delete User" callBack={deleteUserButton} />
    </div>
  );
}
