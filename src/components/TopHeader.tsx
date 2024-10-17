import { Icon } from "@iconify/react/dist/iconify.js";

// interface TopHeaderProps {
//   buttonText: string;
// }

// TODO: create a div section for the profile on the right
// use a placeholder icon for the profile picture
// style the header so that the button and profile are on opposite ends of the
// header (you can use space-between)

const TopHeader = () => {
  return (
    <div className="w-screen border border-black py-8 px-6">
        <button className=" flex flex-row gap-x-2 bg-teal-600 p-2.5 px-3 text-white rounded-md">
            <Icon icon="ic:baseline-plus" width="20" height="20"/>
            Create new event
        </button>
    </div>
  );
};

export default TopHeader;
