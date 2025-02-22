"use client";

import React from "react";
import Image from "next/image";
import { sendMassEmail } from "@api/email/route.client";
import useApiThrottle from "../../../hooks/useApiThrottle";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

export default function CommunicationPage() {
  const [subject, setSubject] = React.useState("");
  const [fromEmail] = React.useState("breadandroses@gmail.com");
  const [text, setText] = React.useState("");

  const { fetching: sendMassEmailLoading, fn: throttledSendMassEmail } =
    useApiThrottle({ fn: sendMassEmail });

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center gap-3 text-4xl font-['Kepler_Std'] font-semibold">
        <GroupRoundedIcon sx={{ width: 44, height: 44 }}></GroupRoundedIcon>
        Send Email To Volunteers
      </div>
      <div className="flex items-start gap-4">
        <div className="w-1/3">
          <p className="font-semibold">Subject</p>
        </div>
        <div className="w-2/3">
          <input
            type="text"
            placeholder="ex: Welcome to Bread & Roses!"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-1/3">
          <p className="font-semibold">Email From</p>
          <p className="text-gray-500">This is the default email.</p>
        </div>
        <div className="w-2/3">
          <input
            type="text"
            disabled
            className="border border-gray-300 rounded-md p-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            value={fromEmail}
          />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-1/3">
          <p className="font-semibold">Email Body</p>
          <p className="text-gray-500">
            This will be sent to all volunteers on the site.
          </p>
        </div>
        <div className="w-2/3 flex flex-col gap-6">
          <div className="border-2 border-gray-300 rounded-md p-4 text-center text-gray-500 cursor-pointer hover:border-teal-600">
            <p>Click to upload or drag and drop</p>
            <p>SVG, PNG, JPG or GIF (max. 3MB)</p>
          </div>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full resize-none"
            placeholder="Type your email content"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-1/3"></div>
        <div className="w-2/3">
          <button
            className="w-[150px] font-semibold bg-teal-600 p-2.5 px-3 text-white rounded-md items-center"
            disabled={sendMassEmailLoading}
            onClick={async () => {
              // FIX TO INCLUDE SUBJECT AND BODY, ETC
              await throttledSendMassEmail(text);
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* <div className="text-center">
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
      </div> */}
    </div>
  );
}
