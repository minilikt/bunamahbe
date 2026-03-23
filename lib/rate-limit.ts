import { LRUCache } from "lru-cache";
import { headers } from "next/headers";

const cache = new LRUCache<string, number>({
  max: 1000,
  ttl: 60 * 1000, // 60 seconds
});

/**
 * Checks if an IP is exceeding the rate limit for a specific action.
 * @param action - The name of the action (e.g., 'castVote')
 * @param limit - Maximum allowed attempts in 1 minute
 * @returns {Promise<{ success: boolean, remaining: number }>}
 */
export async function checkRateLimit(action: string, limit: number = 5) {
  const headList = await headers();
  const ip = headList.get("x-forwarded-for") || headList.get("x-real-ip") || "unknown";
  
  // If IP is unknown, we might be in local dev or behind a misconfigured proxy
  // We'll still limit it using 'unknown' as a shared key
  const key = `${ip}:${action}`;
  
  const currentCount = cache.get(key) || 0;

  if (currentCount >= limit) {
    return { success: false, remaining: 0 };
  }

  cache.set(key, currentCount + 1);
  return { success: true, remaining: limit - (currentCount + 1) };
}
