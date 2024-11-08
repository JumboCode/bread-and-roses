import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Logo from "../app/icons/br-logo.png";
import Communicaton from "../app/icons/communication";
import Divider from "../app/icons/divider";

const SideNavBar = () => {
  return (
    <div className="h-screen w-60 border border-gray-200 fixed left-0">
      <div className="flex place-content-center my-6 ">
        <Image src={Logo} width={215} height={173} alt="bread & roses logo" />
      </div>

      <nav className="flex items-center gap-1 flex-1 px-6 text-lg">
        <ul>
          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full text-darkrose bg-rose rounded-md pt-px pb-px px-3">
              <Icon icon="tabler:home" width="24" height="24" /> Home
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full rounded-md pt-px pb-px px-3">
              <Icon icon="uil:calender" width="24" height="24" /> Events
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full rounded-md pt-px pb-px px-3">
              <Icon icon="pepicons-print:people" width="24" height="24" />{" "}
              Volunteers
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full rounded-md pt-px pb-px px-3">
              <Communicaton />
              Communication
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full rounded-md pt-px pb-px px-3">
              <Icon icon="charm:person" width="24" height="24" /> Profile
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full rounded-md pt-px pb-px px-3">
              <Icon icon="tabler:logout" width="24" height="24" /> Logout
            </button>
          </li>
        </ul>
      </nav>
      <div className="h-64"></div>
      <Divider items-center />

      {/* footer */}
      <div className="h-30 w-60 fixed bottom-0 left-0 pt-6 pr-1.5 pl-1.5 pb-6">
        <div className="flex justify-center flex-col pl-1 gap-y-6">
          <div className="flex gap-5">
            <button className="text-icon-color">
              <Icon icon="gg:facebook" width="24" height="24" />
            </button>

            <button className="text-icon-color">
              <Icon icon="ph:instagram-logo" width="24" height="24" />
            </button>

            <button className="text-icon-color">
              <Icon icon="fa6-brands:x-twitter" width="24" height="24" />
            </button>

            <button className="text-icon-color">
              <Icon icon="mdi:vimeo" width="24" height="24" />
            </button>

            <button className="text-icon-color">
              <Icon icon="akar-icons:linkedin-fill" width="24" height="24" />
            </button>
          </div>

          <div className="flex text-gray-500">
            <h5 className="text-xs ">ⓒ 2024 Bread & Roses</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
