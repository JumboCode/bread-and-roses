"use client"
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../app/icons/br-logo.png";
import Divider from "../app/icons/divider";

// TODO: routing to different pages (make the pages)
// note that the highlight of the button goes away when u click off it!

interface SideNavBarProps {
  role: string;
}

const SideNavBar = ({role}: SideNavBarProps) => {
  const router = useRouter();

  const adminTabs = [
    { name: 'Home', icon: 'tabler:home', href: '/' },
    { name: 'Events', icon: 'uil:calender', href: '/private/events' },
    { name: 'Volunteers', icon: 'pepicons-print:people', href: '/private/volunteers' },
    { name: 'Communication', icon: 'material-symbols:inbox-outline', href: '/private/communication' },
    { name: 'Profile', icon: 'charm:person', href: '/private/profile' },
    { name: 'Logout', icon: 'tabler:logout', href: '/private/logout' },
  ];

  const volunteerTabs = [
    { name: 'Home', icon: 'tabler:home', href: '/' },
    { name: 'Events', icon: 'uil:calender', href: '/private/events' },
    { name: 'Profile', icon: 'charm:person', href: '/private/profile' },
    { name: 'Logout', icon: 'tabler:logout', href: '/private/logout' },
  ];

  const tabs = role === 'admin' ? adminTabs : volunteerTabs;
  
  return (
    <div className="h-screen w-60 border border-gray-200 fixed left-0">
      <div className="flex place-content-center my-6 ">
        <Image src={Logo} width={215} height={173} alt="bread & roses logo" />
      </div>

      {/* <nav className="flex items-center gap-1 flex-1 px-6 text-lg "> */}

    <nav className="flex items-center gap-1 flex-1 px-6 text-lg">
        <ul className="w-full">
          {tabs.map((tab) => (
            <li key={tab.name} >
              <button
                type="button"
                className='nav-button flex gap-3 items-center h-11 w-full text-[18px] font-normal font-medium focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3 ${ router.pathname === tab.path ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }'
                onClick={() => router.replace(tab.href)}
              >
                <Icon icon={tab.icon} width="24" height="24" /> {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

        
        {/* <ul>
          <li>
            <button type="button" className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3" onClick={() => router.replace('/')}>
              <Icon icon="tabler:home" width="24" height="24" /> Home
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3" onClick={() => router.replace('/')}>
              <Icon icon="uil:calender" width="24" height="24" /> Events
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3" onClick={() => router.replace('/')}>
              <Icon icon="pepicons-print:people" width="24" height="24" />{" "}
              Volunteers
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3" onClick={() => router.replace('/')}>
            <Icon icon="material-symbols:inbox-outline" width="24" height="24" /> 
              Communication
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3" onClick={() => router.replace('/')}>
              <Icon icon="charm:person" width="24" height="24" /> Profile
            </button>
          </li>

          <li>
            <button className="nav-button flex gap-3 items-center h-11 text-[18px] font-normal font-medium w-full focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3" onClick={() => router.replace('/')}>
              <Icon icon="tabler:logout" width="24" height="24" /> Logout
            </button>
          </li>
        </ul> */}
      {/* </nav> */}
      {/* <Divider items-center inset-x-0 bottom-0 /> */}

      {/* footer */}
      <div className="h-30 w-60 fixed bottom-0 left-0 pr-1.5 pl-1.5 pb-6">
      <Divider items-center/>
        <div className="flex justify-center flex-col pl-1 gap-y-6 pt-4">
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
