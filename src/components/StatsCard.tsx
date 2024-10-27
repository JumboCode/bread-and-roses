import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface StatsCardProps {
  heading: string;
  value: number | string;
  date: string;
  icon: string;
}

const StatsCard = ({ heading, value, icon, date }: StatsCardProps) => {
  return (
    <div className="w-[360px] h-[160px] h-40 px-6 py-4 bg-white rounded-lg shadow border border-[#e4e7ec] flex-col justify-start items-start gap-4 inline-flex">
      <div className="self-stretch justify-start items-center gap-2 inline-flex">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
          <div className="self-stretch justify-start items-start gap-2 inline-flex">
            <div className="grow shrink basis-0 text-[#344053] text-base font-semibold font-['Sofia Pro'] leading-normal">
              {heading}
            </div>
          </div>
          <div className="self-stretch justify-start items-end gap-4 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch text-[#0f1728] text-5xl font-semibold font-['Kepler Std'] leading-[60px]">
                {value}
              </div>
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 text-[#475466] py-1 text-sm font-medium font-['Inter'] leading-tight">
                  {date}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[110px] h-[110px] relative">
          <Icon
            icon={icon}
            className="size-full"
            style={{ color: "#33BDB5" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
