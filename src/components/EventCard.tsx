import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface EventCardProps {
  title: string;
  start: Date;
  end: Date;
  address: string;
  volunteers: number;
  maxVolunteers: number;
  width?: string | number;
  imageSrc?: string; // option to add image for eventCards in event page
}

const EventCard = ({
  title,
  start,
  end,
  address,
  volunteers,
  maxVolunteers,
  width = 360,
  imageSrc,
}: EventCardProps) => {
  const { t } = useTranslation(["translation"]);
  const isFull = volunteers === maxVolunteers ? true : false;
  const volunteerText =
    volunteers + "/" + maxVolunteers + " " + t("volunteers");
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const optionsDate: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  // Helper function to get ordinal suffix
  function getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  // Format time for both start and end dates
  const startTime = start.toLocaleString("en-US", optionsTime);
  const endTime = end.toLocaleString("en-US", optionsTime);

  // Format the date
  const dateParts = start.toLocaleString("en-US", optionsDate).split(" ");
  const month = dateParts[0];
  const day = parseInt(dateParts[1], 10);
  const year = dateParts[2];
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  // Construct the final string
  const dateText = `${startTime} - ${endTime} / ${month} ${dayWithSuffix}, ${year}`;

  return (
    <div
      style={{ width }}
      className="h-auto px-5 py-5 bg-white rounded-lg shadow border border-[#e4e7ec] flex-col justify-start items-start gap-4 inline-flex"
    >
      <div className="self-stretch justify-start items-center inline-flex">
        {imageSrc && (
          <div className="mr-[32px]">
            <Image
              src={imageSrc}
              alt="event image"
              width={175}
              height={175}
              className="cursor-pointer"
            />
          </div>
        )}
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
          <div className="self-stretch justify-start items-start gap-2 inline-flex">
            <div className="inline-flex w-full grow shrink basis-0 text-[#101828] text-base font-semibold font-['Sofia Pro'] leading-[18px] ">
              {title}
            </div>
          </div>
          <div className="self-stretch justify-start items-end gap-4 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
              <div className="w-full self-stretch flex flex-row items-center text-[#344054] text-sm font-medium font-['Sofia Pro'] text-[14px] leading-[20px]">
                <Icon
                  icon="mdi:clock-outline"
                  width="12"
                  height="12"
                  className="mr-2"
                />
                {dateText}
              </div>
              <div className="w-full self-stretch flex flex-row items-center text-[#344054] text-sm font-medium font-['Sofia Pro'] text-[14px] leading-[20px]">
                <Icon
                  icon="mingcute:location-line"
                  width="12"
                  height="12"
                  className="mr-2"
                />
                {address}
              </div>
              <div className="w-full border-b border-0.5 border-[#F2F4F7]" />
              <div className="self-stretch justify-start items-center inline-flex">
                <div
                  className={`w-[153px] h-[20px] inline-flex grow shrink basis-0 text-[#475466] text-sm pr-3 text-[14px] font-semibold leading-[20px] ${
                    isFull ? "text-[#E61932]" : "text-[#558D22]"
                  }`}
                >
                  {volunteerText}
                </div>
                <button className="flex justify-end flex-row gap-x-2 bg-teal-600 px-3.5 py-1 text-white rounded-lg place-items-center text-[14px] font-semibold leading-[20px]">
                  {t("see_details")}
                  <Icon icon="formkit:arrowright" width="20" height="21" />
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
