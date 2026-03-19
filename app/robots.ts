import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bunamahber.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/election", "/quiz", "/community", "/map", "/join", "/login"],
        disallow: ["/admin", "/admin/", "/dashboard", "/dashboard/", "/onboarding", "/onboarding/", "/api", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
