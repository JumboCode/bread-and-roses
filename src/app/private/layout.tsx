"use client";

import SideNavBar from "@components/SideNavBar";
import TopHeader from "@components/TopHeader";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getLanguageFromCookie } from "../../lib/languages";
import WindowSizeCheck from "@components/WindowSizeCheck";
import Image from "next/image";

interface IHomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t, i18n } = useTranslation(["translation"]);

  useEffect(() => {
    // Set the language from the cookie on page load
    i18n.changeLanguage(getLanguageFromCookie());
  }, [i18n]);

  if (!session) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        {t("Loading")}...
      </div>
    );
  }

  if (pathname === "/private/check-in-out") {
    return <>{children}</>;
  }

  return (
    // TODO: change it so that if WindowSizeCheck returns false this runs, and if true we want to show the error thing.
    // not a huge deal if this does not work, we can also just use media screens because the main concern
    // is that we don't want users to access the website on the phone because it'll look really weird
    // but this way is def better because its more custimizable
    <WindowSizeCheck>
      <div>
        <div className="hidden justify-center items-center min-h-screen">
          <Image
            src="/empty_list.png"
            alt="Error"
            layout="intrinsic"
            width={215}
            height={173}
          />
        </div>

        <div className="block flex min-h-screen">
          <SideNavBar user={session.user} />
          <div className="flex-1 ml-60">
            <TopHeader user={session.user} />
            <div className="py-6 px-7">{children}</div>
          </div>
        </div>

        <div className="md:hidden lg:hidden flex justify-center items-center h-screen">
          <Image
            src="/empty_list.png"
            alt="Error"
            layout="intrinsic"
            width={215}
            height={173}
          />
        </div>

        <div className="sm:hidden lg:block md:block flex min-h-screen">
          <SideNavBar user={session.user} />
          <div className="flex-1 ml-60">
            <TopHeader user={session.user} />
            <div className="py-6 px-7">{children}</div>
          </div>
        </div>
      </div>
    </WindowSizeCheck>
  );
};

export default HomeLayout;
