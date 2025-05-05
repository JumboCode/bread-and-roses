"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import ProfileContent from "@components/ProfileContent";
import { UserWithVolunteerDetail } from "../../../types";
import { VolunteerSession } from "@prisma/client";
import { getUser } from "@api/user/route.client";
import { useTranslation } from "react-i18next";

export default function UserProfilePage() {
  const { userId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("profile");

  const [user, setUser] = useState<UserWithVolunteerDetail | null>(null);
  const [sessions, setSessions] = useState<VolunteerSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading" || !session?.user) return;

    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      router.replace(`/private/profile/${session.user.id}`);
      return;
    }

    const fetchData = async () => {
      try {
        if (!userId) return;

        const response = await getUser(userId as string);

        if (response.data) {
          setUser(response.data);
          setSessions(response.data.volunteerSessions);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, router, status, session?.user]);

  if (loading || !user) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl">
        {t("loading")}...
      </div>
    );
  }

  const isEditable = session?.user.id === user.id;

  return (
    <ProfileContent
      user={user}
      volunteerSessions={sessions}
      editable={isEditable}
    />
  );
}
