import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

interface Subtexts {
  text: string;
  icon: string;
}

interface EventCardProps {
  title: string;
  subtexts?: Subtexts[];
  actionButton?: React.ReactNode;
  onClick?: () => void;
  width?: string | number;
  imageSrc?: string; // option to add image for eventCards in event page
}

const EventCard = ({
  title,
  subtexts,
  actionButton,
  width = 360,
  imageSrc,
}: EventCardProps) => {
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
              {subtexts?.map((subtext, index) => (
                <div
                  className="w-full self-stretch flex flex-row items-center text-[#344054] font-medium font-['Sofia Pro'] text-[16px] leading-[20px]"
                  key={index}
                >
                  <Icon
                    icon={subtext.icon}
                    width="16"
                    height="16"
                    className="mr-2"
                    color="#138D8A"
                  />
                  {subtext.text}
                </div>
              ))}

              <div className="self-stretch justify-end items-center inline-flex">
                {actionButton && (
                  <div className="flex justify-end flex-row gap-x-2">
                    {actionButton}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
