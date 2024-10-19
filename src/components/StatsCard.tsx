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
    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className ="flex flex-col justify-between">
            <h2 className="font-style font-bold text-black">{heading}</h2>
            <p className="font-style font-bold text-black text-6xl">{value}</p>
            <div className="text-right">
              <Icon icon={icon} className="text-5xl" style={{ color: '#33BDB5' }} />
            </div>
            <p className="font-style text-gray-200">{date}</p>
        </div>
    </div>
  );
};

export default StatsCard;
