"use client";

import React from "react";
import Image from "next/image";
import { getUser, updateUser } from "@api/user/route.client";
// import ExampleButton from "@components/ExampleButton";
import { Role, User, VolunteerDetails } from "@prisma/client";

import { getEvent, updateEvent } from "@api/event/route.client";
import { Event } from "@prisma/client";

// import { addUser } from "@api/user/route.client";
// type CreateVolunteerDetailsInput = Omit<
//   VolunteerDetails,
//   "id" | "user" | "userId"
// >;

// const user = {
//   id: "12345", // Example user ID
//   role: "ADMIN",
//   firstName: "John",
//   lastName: "Doe",
//   email: "wonkim025@gmail.com",
//   password: "$2a$10$e8vyqI0n5picVCfi6yUYZeSnXe/5kb3axrdDP3aadAflIDpW9hWjW"

// };

const handleUpdateProfile = async () => {
  // const user = await getUser("675a4c9b0cbad979b1058522"); // Wait for the resolved user object
  // const volunteerDetails = await getUser("675a2dd432ac78e2748d2519"); // This can be filled as needed
  // console.log(user);
  // const vDetails = user.volunteerDetails;

  /*
  const response = await getUser(userID);
  const fetchedUser = response.data.user;
  const fetchedVD = response.data.volunteerDetails;
  */

  // const response = await getUser("675a4c9b0cbad979b1058522");
  // const fetchedUser = response.data.user;
  // const fetchedVD = response.data.volunteerDetails;

  // await updateUser(fetchedUser, fetchedVD); // Now call updateUser with the correct user object

  const response = await getEvent("67942018b47a30a5cee9c9bd");
  const fetchedEvent = response.data.id;
  // const fetchedEvent = "HELLO";
  
  console.log("Response: ", response);
  // console.log(fetchedEvent);

  // await updateEvent(fetchedEvent); // Now call updateUser with the correct user object

  // test 1
  // const response1 = await getEvent("67b8dcdb786ad2a7cb153e36");
  // const events: Event[] = response.data;
  // const fetchedEvent1 = events.find(
  //   (event) => event.id === "67b8dcdb786ad2a7cb153e36"
  // );

  // if (fetchedEvent1) {
  //   console.log(fetchedEvent1.eventName);
  // } else {
  //   console.log("Event not found");
  // }
};

export default function ProfilePage() {
  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold">Profile</div>
      <div className="text-center">
        <div className="relative w-full h-[50vh]">
          <Image
            src="/empty_list.png"
            alt="Empty List"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="text-[#344054] font-['Kepler_Std'] text-3xl font-semibold mt-8">
          Coming Soon!
        </div>
      </div>
      <div className="text-center mt-8">
        {/* Button to trigger profile update */}
        {/* <button
          // onClick={updateUser}
          // onClick={() => updateUser(user, volunteerDetails)}
          // onClick={handleUpdateProfile()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md"
        >
          Update Profile
        </button> */}

        <button
          onClick={async (event) => {
            event.preventDefault(); // Optional
            handleUpdateProfile();
          }}
        >
          Get Event
        </button>
      </div>
    </div>
  );
}
