import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface DashboardAlertProps {
  Title: string;
  Subtext: number | string;
}

const DashboardAlert = ({ Title, Subtext }: DashboardAlertProps) => {
    return (
        <div className="ml-8 flex items-start shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),_0px_2px_4px_-2px_rgba(16,24,40,0.06)">
            <div className="flex w-[40px] py-0 px-[8px] items-center gap-[10px] self-stretch rounded-tl-[8px] rounded-bl-[8px] bg-[#FF8B14]">
                <div>
                <Icon icon="lucide:info" width="24" height="24" />
                </div>
            </div>
            <div className="flex w-[1094px] h-[116px] p-[24px] px-[28px] items-start gap-[16px] rounded-tr-[8px] rounded-br-[8px] border border-[#FF8B14] bg-[#FFF]">
                {/* Hello*/}
            </div>
        </div>
    );
};

export default DashboardAlert;
