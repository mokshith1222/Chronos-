import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chronos-lime-six.vercel.app"

  const routes = [
    "",
    "/privacy",
    "/terms",
    "/contact",
    "/help",
    "/docs",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  return [...routes]
}
