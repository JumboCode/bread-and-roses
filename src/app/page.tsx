"use client";
import CreateUserForm from "@components/createUserForm";
import { User } from "@prisma/client";
import { useState } from "react";
import { getUserByEmail } from "@api/user/route.client";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");

  const getUser = async () => {
    try {
      const response = await getUserByEmail(email);
      const fetchedUser = response.data.user;

      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen flex-col space-y-4">
      <CreateUserForm />
      <button
        onClick={getUser}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get User
      </button>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        className="border rounded p-2"
      />
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
