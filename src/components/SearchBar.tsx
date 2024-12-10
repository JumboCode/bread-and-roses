import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SearchBarProps {
  Title: string;
  Subtext: number | string;
}

const SearchBar = ({ Title, Subtext }: SearchBarProps) => {
    return (
        <div className="flex items-start relative">
            {/* Main Content Box */}
            <div className="w-full flex justify-center flex-col shadow-md h-[44px] w-[480px] items-start gap-[16px] rounded-tr-[8px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px] border border-[#Grey/500] bg-[#FFF] relative">
                {/* Close Icon positioned in the top-right corner */}
                <div className="flex justify-start">
                    <Icon icon="material-symbols-light:search" width="24" height="24" style={{ color: 'grey/500' }} />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;


