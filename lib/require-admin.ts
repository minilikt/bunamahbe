import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/join");
  }

  if (session.user.role !== "ADMIN") {
    await auditLog("UNAUTHORIZED_ADMIN_ACCESS", session.user.id, {
      role: session.user.role,
      source: "admin-route",
    });
    redirect("/dashboard");
  }

  return session;
}
