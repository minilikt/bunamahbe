import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const resendFallback = process.env.RESEND_API_KEY_FALLBACK 
  ? new Resend(process.env.RESEND_API_KEY_FALLBACK) 
  : null;

const PRIMARY_DOMAIN = "bunamahber.com";
const FALLBACK_DOMAIN = process.env.RESEND_DOMAIN_FALLBACK || "bunamahber.me";

export interface SendEmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Sends an email using the primary Resend client.
 * If it fails (e.g. out of credits), it attempts to send using the fallback client and domain.
 */
export async function sendEmail(options: SendEmailOptions) {
  // 1. Try Primary
  try {
    const from = options.from || `Buna <hello@${PRIMARY_DOMAIN}>`;
    const { data, error } = await resend.emails.send({
      ...options,
      from,
    });

    if (!error) {
      return { data, error: null };
    }

    // If there's an error, log it and check if we should fallback
    console.error("[RESEND] Primary email send failed:", error);
    
    // We fallback if there's no data (meaning it didn't even start) or if we have a fallback client
    if (!resendFallback) {
      return { data: null, error };
    }
  } catch (err) {
    console.error("[RESEND] Primary email send threw exception:", err);
    if (!resendFallback) throw err;
  }

  // 2. Try Fallback
  console.log("[RESEND] Attempting fallback email send...");
  const fallbackFrom = options.from?.replace(PRIMARY_DOMAIN, FALLBACK_DOMAIN) 
    || `Buna <hello@${FALLBACK_DOMAIN}>`;

  return await resendFallback!.emails.send({
    ...options,
    from: fallbackFrom,
  });
}
