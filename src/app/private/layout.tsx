"use client";

import SideNavBar from "@components/SideNavBar";
import TopHeader from "@components/TopHeader";
import { useSession } from "next-auth/react";

interface IHomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        Loading...
      </div>
    );
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
