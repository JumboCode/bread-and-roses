"use client";
import { useState } from "react";
import { getUserByEmail } from "@api/user/route.client";
import { User } from "@prisma/client";

interface ExampleSignUpProps {
  setUser: (user: User | null) => void;
}

const ExampleSignUp = ({ setUser }: ExampleSignUpProps) => {
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
    <div className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        className="border rounded p-2"
      />
      <button
        onClick={getUser}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get User
      </button>
    </div>
  );
};

export default ExampleSignUp;
