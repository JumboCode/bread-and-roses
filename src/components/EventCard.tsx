import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface EventCardProps {
  title: string;
  date: string;
  address: string;
  volunteers: number;
  maxVolunteers: number;
}

const EventCard = ({
  title,
  date,
  address,
  volunteers,
  maxVolunteers,
}: EventCardProps) => {
  const isFull = volunteers === maxVolunteers ? true : false;
  const volunteerText = volunteers + "/" + maxVolunteers + " volunteers";
  return (
    <div className="w-[360px] h-auto px-5 py-5 bg-white rounded-lg shadow border-1 border-[#e4e7ec] flex-col justify-start items-start gap-4 inline-flex">
      <div className="self-stretch justify-start items-center inline-flex">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
          <div className="self-stretch justify-start items-start gap-2 inline-flex">
            <div className="grow shrink basis-0 text-[#101828] text-base font-semibold font-['Sofia Pro'] leading-[18px] ">
              {title}
            </div>
          </div>
          <div className="self-stretch justify-start items-end gap-4 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
              <div className="self-stretch flex flex-row items-center text-[#344054] text-sm font-medium font-['Sofia Pro'] text-[14px] leading-[20px]">
                <Icon
                  icon="mdi:clock-outline"
                  width="12"
                  height="12"
                  className="mx-2"
                />
                {date}
              </div>
              <div className="self-stretch flex flex-row items-center text-[#344054] text-sm font-medium font-['Sofia Pro'] text-[14px] leading-[20px]">
                <Icon
                  icon="mingcute:location-line"
                  width="12"
                  height="12"
                  className="mx-2"
                />
                {address}
              </div>
              <div className="w-full border-b border-0.5 border-[#F2F4F7]">
                {" "}
              </div>
              <div className="self-stretch justify-start items-center inline-flex">
                <div
                  className={`w-[153px] h-[20px] grow shrink basis-0 text-[#475466] text-sm font-medium font-['Sofia Pro'] pr-3 text-[14px] font-semibold leading-[20px] ${
                    isFull ? "text-[#E61932]" : "text-[#558D22]"
                  }`}
                >
                  {volunteerText}
                </div>
                <button className="flex justify-end flex-row gap-x-2 bg-teal-600 px-3.5 py-1 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]">
                  See details
                  <Icon icon="formkit:arrowright" width="20" height="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
