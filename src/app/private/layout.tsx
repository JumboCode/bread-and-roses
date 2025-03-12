"use client";

import SideNavBar from "@components/SideNavBar";
import TopHeader from "@components/TopHeader";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getLanguageFromCookie } from "../../lib/languages";

interface IHomeLayoutProps {
  children: React.ReactNode;

  // maybe affects each child (valid react node)
  // WindowSizeCheck {
  //   children: React.ReactNode;
  // }
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
    <div className="flex min-h-screen">
      <SideNavBar user={session.user} />
      <div className="flex-1 ml-60">
        <TopHeader user={session.user} />
        <div className="py-6 px-7">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
