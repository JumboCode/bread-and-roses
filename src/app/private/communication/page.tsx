"use client";

import React from "react";
import Image from "next/image";
import { sendMassEmail } from "@api/email/route.client";
import useApiThrottle from "../../../hooks/useApiThrottle";

export default function CommunicationPage() {
  const [text, setText] = React.useState("");

  const { fetching: sendMassEmailLoading, fn: throttledSendMassEmail } =
    useApiThrottle({ fn: sendMassEmail });

  return (
    <div>
      <div className="text-4xl font-['Kepler_Std'] font-semibold">
        Communication
      </div>
      <div className="flex flex-col w-[800px]">
        {/* <label htmlFor={postTextAreaId}>Write your message:</label> */}
        <textarea
          className="border border-gray-500"
          // id={postTextAreaId}
          name="postContent"
          rows={4}
          cols={40}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button
          className="w-[150px] font-semibold bg-teal-600 p-2.5 px-3 text-white rounded-md items-center"
          onClick={async () => {
            await throttledSendMassEmail(text);
          }}
        >
          Send
        </button>
      </div>

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
    </div>
  );
}
