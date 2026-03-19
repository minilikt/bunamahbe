import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

type MemberSession = {
  user: {
    id: string;
    city?: string | null;
    favoriteType?: string | null;
  };
};

export async function requireMember(): Promise<MemberSession> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as MemberSession | null;

  if (!session || !session.user) {
    redirect("/join");
  }

  return session;
}

export function hasCompletedOnboarding(session: MemberSession): boolean {
  return Boolean(session.user.city && session.user.favoriteType);
}
