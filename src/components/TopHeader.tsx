import { Icon } from "@iconify/react/dist/iconify.js";

interface TopHeaderProps {
  userType: string;
}

const TopHeader = ({ userType }: TopHeaderProps) => {
  // different button text and icon depending on if the user is a volunteer or admin
  const buttonText = userType === "admin" ? "Create new event" : "Check in";
  const icon = userType === "admin" ? "ic:baseline-plus" : "mdi:checkbox-outline";
  return (
    <div className="flex flex-row w-screen border border-black py-8 px-6 place-content-between">
      <button className="flex flex-row gap-x-2 bg-teal-600 p-2.5 px-3 text-white rounded-md place-items-center">
        <Icon icon={icon} width="20" height="20" />
        {buttonText}
      </button>
      <div className="flex flex-row justify-self-end place-items-center gap-x-2">
        <h1 className="font-medium">SP</h1>
        <Icon icon="ion:switch" width="40" height="40" />
        <h1 className="text-teal-600 font-medium">EN</h1>
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
