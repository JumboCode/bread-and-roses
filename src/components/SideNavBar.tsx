"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../app/icons/br-logo.png";
import Divider from "../app/icons/divider";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Role } from "@prisma/client";
import { VolunteerDetails } from "../types/next-auth";

interface SideNavBarProps {
  user: {
    id: string;
    role: "VOLUNTEER" | "ADMIN";
    firstName: string;
    lastName: string;
    email: string;
    volunteerDetails?: VolunteerDetails | null;
  };
}

const SideNavBar = ({ user }: SideNavBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const adminTabs = [
    { name: "Home", icon: "tabler:home", href: "/private" },
    { name: "Events", icon: "uil:calender", href: "/private/events" },
    {
      name: "Volunteers",
      icon: "pepicons-print:people",
      href: "/private/volunteers",
    },
    {
      name: "Communication",
      icon: "material-symbols:inbox-outline",
      href: "/private/communication",
    },
    { name: "Profile", icon: "charm:person", href: "/private/profile" },
    { name: "Logout", icon: "tabler:logout", href: "" },
  ];

  const volunteerTabs = [
    { name: "Home", icon: "tabler:home", href: "/private" },
    { name: "Events", icon: "uil:calender", href: "/private/events" },
    { name: "Profile", icon: "charm:person", href: "/private/profile" },
    { name: "Logout", icon: "tabler:logout", href: "" },
  ];

  const tabs = user.role === Role.ADMIN ? adminTabs : volunteerTabs;

  return (
    <div className="h-screen w-60 border-t border-r border-gray-200 fixed left-0">
      <div className="flex place-content-center my-6 ">
        <Image
          className="cursor-pointer"
          src={Logo}
          width={215}
          height={173}
          alt="bread & roses logo"
          onClick={() => router.replace("/private")}
        />
      </div>

      <nav className="flex items-center gap-1 flex-1 px-6 text-lg">
        <ul className="w-full">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <button
                type="button"
                className={`nav-button flex gap-3 items-center h-11 w-full text-[18px] font-medium focus:text-darkrose focus:bg-rose rounded-md pt-px pb-px px-3 ${
                  pathname === tab.href ? "text-darkrose bg-rose" : ""
                }`}
                onClick={() =>
                  tab.name === "Logout"
                    ? signOut({ callbackUrl: "/public/signIn" })
                    : router.replace(tab.href)
                }
              >
                <Icon icon={tab.icon} width="24" height="24" /> {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* footer */}
      <div className="h-30 w-60 fixed bottom-0 left-0 pr-1.5 pl-1.5 pb-6">
        <Divider items-center />
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
