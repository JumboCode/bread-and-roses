import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface EventCardProps {
  title: string;
  date: string;
  address: string;
  volunteers: string;
}

const EventCard = ({ title, date, address, volunteers }: EventCardProps) => {
  return (
    <div className="w-[360px] h-[160px] px-6 py-4 bg-white rounded-lg shadow border border-[#e4e7ec] flex-col justify-start items-start gap-4 inline-flex">
      <div className="self-stretch justify-start items-center gap-2 inline-flex">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
          <div className="self-stretch justify-start items-start gap-2 inline-flex">
            <div className="grow shrink basis-0 text-[#344053] text-base font-semibold font-['Sofia Pro'] leading-[18px]">
              {title}
            </div>
          </div>
          <div className="self-stretch justify-start items-end gap-4 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch flex flex-row items-center text-[#0f1728] text-base font-medium font-['Sofia Pro'] leading-[18px]">
                <Icon
                  icon="mdi:clock-outline"
                  width="12"
                  height="12"
                  className="mx-2"
                />
                {date}
              </div>
              <div className="self-stretch flex flex-row items-center text-[#0f1728] text-base font-medium font-['Sofia Pro'] leading-[18px]">
                <Icon
                  icon="mingcute:location-line"
                  width="12"
                  height="12"
                  className="mx-2"
                />
                {date}
              </div>
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 text-[#475466] py-1 text-sm font-medium font-['Sofia Pro'] leading-tight">
                  {volunteers}
                </div>
                <button className="flex flex-row gap-x-2 bg-teal-600 p-2.5 px-3 text-white rounded-full place-items-center">
                  See details
                  <Icon
                    icon="formkit:arrowright"
                    width="20"
                    height="20"
                    className="mx-2"
                  />
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
