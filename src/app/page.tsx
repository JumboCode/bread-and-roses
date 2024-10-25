"use client";

import ExampleButton from "@components/ExampleButton";
import CreateUserForm from "@components/createUserForm";
import { useState } from "react";
import { getUser, deleteUser } from "@api/user/route.client";
import { Prisma, User, VolunteerDetails } from "@prisma/client";

export default function Home() {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState<User>();
  const [volunteerDetails, setVolunteerDetails] = useState<VolunteerDetails>();

  const getUserButton = async () => {
    try {
      const fetchedUser = await getUser(userID);
      console.log("THIS IS USER: ", fetchedUser);
      setUser(fetchedUser);
      setVolunteerDetails()
      console.log("User fetched successfully.");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const deleteUserButton = async () => {
    try {
      await deleteUser(userID);
      setUser(undefined);
      console.log("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateUserButton = async () => {
    try {
      // const fetchedUser = await
      let updatedUser = {
        firstname: "Justin",
        ...user,
      };

      const fetchedUser = await getUser(userID);
      console.log("THIS IS USER: ", fetchedUser);
      setUser(fetchedUser.data.firstName);
      console.log("User fetched successfully.");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <CreateUserForm setUserID={setUserID}></CreateUserForm>
      {/* Example Button (ExampleButton.tsx in components folder) */}
      <ExampleButton buttonText="Fetch User" callBack={getUserButton} />
      {user ? <view>{user.email}</view> : <view>No user...</view>}
      <ExampleButton buttonText="Delete User" callBack={deleteUserButton} />
    </div>
  );
}
