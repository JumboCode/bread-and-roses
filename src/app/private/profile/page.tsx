"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("profile");

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user.id) {
      router.replace(`/private/profile/${session.user.id}`);
    }
  }, [session, status, router]);

  return (
    <div className="h-screen flex justify-center items-center text-3xl">
      {t("loading")}...
    </div>
  );
}
