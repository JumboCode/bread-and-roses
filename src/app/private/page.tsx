"use client";

import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return <p>You are not logged in.</p>;
  }

  console.log(session.user);

  return (
    <div>
      <h1>Home Page</h1>
      <div>Welcome, {session.user?.firstName || "User"}!</div>
    </div>
  );
}
