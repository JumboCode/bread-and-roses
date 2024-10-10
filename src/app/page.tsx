"use client";

import { addUser } from "./api/user/route.client";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* Test Button */}
      <button
        className="bg-slate-700 text-white p-4 rounded-full"
        onClick={async () => {
          const response = await addUser({
            body: {
              user: {
                firstName: "Johnny",
                email: "johnny.tan.best.pm@tufts.edu",
              },
            },
          });
          console.log(response);
        }}
      >
        Add User
      </button>
    </div>
  );
}
