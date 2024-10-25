"use client";

import ExampleButton from "@components/ExampleButton";
import CreateUserForm from "@components/createUserForm";
import { useState } from "react";
import { getUser, deleteUser } from "@api/user/route.client";

export default function Home() {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState(null);

  const getUserButton = async () => {
    try {
      const fetchedUser = await getUser({
        id: userID,
      });
      console.log("THIS IS USER: ", fetchedUser);
      setUser(fetchedUser.data.firstName);
      console.log("User fetched successfully.");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const deleteUserButton = async () => {
    try {
      await deleteUser({
        id: userID,
      });
      setUser(null);
      console.log("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <CreateUserForm setUserID={setUserID}></CreateUserForm>
      {/* Example Button (ExampleButton.tsx in components folder) */}
      <ExampleButton buttonText="Fetch User" callBack={getUserButton} />
      {user ? <view>{user}</view> : <view>No user...</view>}
      <ExampleButton buttonText="Delete User" callBack={deleteUserButton} />
    </div>
  );
}
