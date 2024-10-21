import React from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

interface StatsCardProps {
  heading: string;
  value: number | string;
  date: string;
  icon: string;
}

const StatsCard = ({ heading, value, icon, date }: StatsCardProps) => {
  return (
    <div className="block w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg relative h-256 w-512">
      <div className="flex flex-col justify-between h-full">
        <h2 className="absolute inset-x-0 top-0 h-16 font-style font-bold text-black">{heading}</h2>
        <p className="font-style font-bold text-black text-6xl">{value}</p>
        <div className="absolute inset-y-0 right-0 w-16">
          <Icon icon={icon} className="text-8xl" style={{ color: '#33BDB5' }} />
        </div>
        <p className="absolute inset-x-0 bottom-0 h-6 font-style text-gray-200">{date}</p>
      </div>
    </div>
  );
};

export default StatsCard;
