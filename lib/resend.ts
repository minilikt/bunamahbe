import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

interface ResendClient {
  client: Resend;
  domain: string;
}

const PRIMARY_DOMAIN = "bunamahber.com";

// Initialize fallback clients
const fallbackClients: ResendClient[] = [];

if (process.env.RESEND_API_KEY_FALLBACK) {
  fallbackClients.push({
    client: new Resend(process.env.RESEND_API_KEY_FALLBACK),
    domain: process.env.RESEND_DOMAIN_FALLBACK || "bunamahber.me"
  });
}

if (process.env.RESEND_API_KEY_FALLBACK_2) {
  fallbackClients.push({
    client: new Resend(process.env.RESEND_API_KEY_FALLBACK_2),
    domain: process.env.RESEND_DOMAIN_FALLBACK_2 || "pulslabs.tech"
  });
}

if (process.env.RESEND_API_KEY_FALLBACK_3) {
  fallbackClients.push({
    client: new Resend(process.env.RESEND_API_KEY_FALLBACK_3),
    domain: process.env.RESEND_DOMAIN_FALLBACK_3 || "habeshaprogeny.tech"
  });
}

export interface SendEmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Sends an email using the primary Resend client.
 * If it fails, it attempts to send using available fallback clients in order.
 */
export async function sendEmail(options: SendEmailOptions) {
  // 1. Try Primary
  try {
    const from = options.from || `Buna <hello@${PRIMARY_DOMAIN}>`;
    const { data, error } = await resend.emails.send({
      ...options,
      from,
    });

    if (!error) return { data, error: null };

    console.error(`[RESEND] Primary (${PRIMARY_DOMAIN}) failed:`, error);
  } catch (err) {
    console.error(`[RESEND] Primary (${PRIMARY_DOMAIN}) exception:`, err);
  }

  // 2. Try Fallbacks
  for (const fallback of fallbackClients) {
    try {
      console.log(`[RESEND] Attempting fallback with domain: ${fallback.domain}`);
      
      const fallbackFrom = options.from?.replace(PRIMARY_DOMAIN, fallback.domain) 
        || `Buna <hello@${fallback.domain}>`;

      const { data, error } = await fallback.client.emails.send({
        ...options,
        from: fallbackFrom,
      });

      if (!error) return { data, error: null };

      console.error(`[RESEND] Fallback (${fallback.domain}) failed:`, error);
    } catch (err) {
      console.error(`[RESEND] Fallback (${fallback.domain}) exception:`, err);
    }
  }

  return { 
    data: null, 
    error: { message: "All email providers failed", name: "all_providers_failed" } 
  };
}
