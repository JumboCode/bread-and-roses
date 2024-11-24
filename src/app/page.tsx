"use client";
import CreateUserForm from "@components/createUserForm";
import { User } from "@prisma/client";
import { useState } from "react";

import ExampleSignUp from "@components/ExampleSignUp";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userID, setUserID] = useState<string>("");

  return (
    <div className="flex items-center justify-center h-screen flex-col space-y-4">
      <CreateUserForm setUserID={setUserID} />
      <ExampleSignUp setUser={setUser} />
      {user && (
        <div>
          <h2>User Details:</h2>
          <p>Name: {user.firstName}</p>
          <p>Email: {user.email}</p>
          <p>userID: {userID}</p>
          {/* Display other user details as needed */}
        </div>
      )}
    </div>
  );
}
