import { headers } from "next/headers";

export async function auditLog(action: string, userId: string, details: any) {
  const headList = await headers();
  const ip = headList.get("x-forwarded-for") || headList.get("x-real-ip") || "unknown";
  const userAgent = headList.get("user-agent") || "unknown";

  console.log(`[AUDIT_LOG] [${new Date().toISOString()}]`);
  console.log(`Action: ${action}`);
  console.log(`User ID: ${userId}`);
  console.log(`IP: ${ip}`);
  console.log(`User Agent: ${userAgent}`);
  console.log(`Details: ${JSON.stringify(details)}`);
  console.log('-----------------------------------');
}
