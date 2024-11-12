"use client";
import CreateUserForm from "@components/createUserForm";
import { User } from "@prisma/client";
import { useState } from "react";

import ExampleSignUp from "@components/ExampleSignUp";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="flex items-center justify-center h-screen flex-col space-y-4">
      <CreateUserForm />
      <ExampleSignUp setUser={setUser} />
      {user && (
        <div>
          <h2>User Details:</h2>
          <p>Name: {user.firstName}</p>
          <p>Email: {user.email}</p>
          {/* Display other user details as needed */}
        </div>
      )}
    </div>
  );
}


