import { createFileRoute } from "@tanstack/react-router";
import { Sentinel } from "@/components/Sentinel";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Social Intelligence | Global Sentinel" },
      { name: "description", content: "Global Sentinel News & Social Intelligence: GSOC situational awareness and OSINT for employee, traveler and office safety." },
      { property: "og:title", content: "News & Social Intelligence | Global Sentinel" },
      { property: "og:description", content: "GSOC situational awareness & OSINT — news & social intelligence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Sentinel tab="news" />,
});
