import { redirect } from "next/navigation";

import { hasCompletedOnboarding, requireMember } from "@/lib/require-member";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireMember();

  if (!hasCompletedOnboarding(session)) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
