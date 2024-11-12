import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface DashboardAlertProps {
  Title: string;
  Subtext: number | string;
}

const DashboardAlert = ({ Title, Subtext }: DashboardAlertProps) => {
    return (
        <div className="ml-8 flex items-start relative">
            {/* Side Tab */}
            <div className="flex shadow-md w-[40px] py-0 px-[8px] items-center gap-[10px] self-stretch rounded-tl-[8px] rounded-bl-[8px] bg-[#FF8B14]">
                <Icon icon="lucide:info" width="24" height="24" style={{ color: 'white' }} />
            </div>
            
            {/* Main Content Box */}
            <div className="flex flex-col shadow-md w-[1094px] h-[116px] p-[24px] px-[28px] items-start gap-[16px] rounded-tr-[8px] rounded-br-[8px] border border-[#FF8B14] bg-[#FFF] relative">
                <div className="text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal">
                    {Title}
                </div>
                <div className="text-[#344054] text-base font-normal font-['Sofia Pro'] leading-normal">
                    {Subtext}
                </div>

                {/* Close Icon positioned in the top-right corner */}
                <div className="absolute top-6 right-7">
                    <Icon icon="icon-park-outline:close-one" width="24" height="24" style={{ color: 'grey/500' }} />
                </div>
            </div>
        </div>
    );
};

export default DashboardAlert;


