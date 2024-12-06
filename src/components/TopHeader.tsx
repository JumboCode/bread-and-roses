import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface TopHeaderProps {
  userType: string;
}

const TopHeader = ({ userType }: TopHeaderProps) => {
  // different button text and icon depending on if the user is a volunteer or admin
  const buttonText = userType === "admin" ? "Create new event" : "Check in";
  const icon =
    userType === "admin" ? "ic:baseline-plus" : "mdi:checkbox-outline";

  const [isEnglish, setIsEnglish] = React.useState(true);

  return (
    <div className="absolute fixed top-0 flex flex-row w-[calc(100%-15rem)] border border-gray-200 py-5 px-6 place-content-between">
      <button className="flex flex-row gap-x-2 bg-teal-600 p-2.5 px-3 text-white rounded-md place-items-center">
        <Icon icon={icon} width="20" height="20" />
        {buttonText}
      </button>
      <div className="flex flex-row justify-self-end place-items-center gap-x-2">
        <h1 className={`${!isEnglish ? "text-teal-600" : ""} font-medium`}>
          SP
        </h1>

        {/* making toggle switch from scratch*/}
        <div>
          <label
            htmlFor="check"
            className="flex bg-gray-200 cursor-pointer relative w-[36px] h-[20px] rounded-full"
          >
            <input
              type="checkbox"
              id="check"
              className="sr-only peer"
              checked={isEnglish}
              onChange={() => setIsEnglish(!isEnglish)}
            />
            <span className="w-[16px] h-[16px] bg-teal-600 absolute rounded-full left-1 top-0.5 peer-checked:left-4 transition-all duration-500" />
          </label>
        </div>

        <h1 className={`${isEnglish ? "text-teal-600" : ""} font-medium`}>
          EN
        </h1>
        <Icon icon="gg:profile" width="40" height="40" className="mx-2" />
        <div>
          <h1 className="font-bold"> An Tran </h1>
          <h2 className="text-gray-500"> {userType} </h2>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
