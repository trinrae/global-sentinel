import { createFileRoute } from "@tanstack/react-router";
import { Sentinel } from "@/components/Sentinel";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resource Directory | Global Sentinel" },
      { name: "description", content: "Global Sentinel Resource Directory: GSOC situational awareness and OSINT for employee, traveler and office safety." },
      { property: "og:title", content: "Resource Directory | Global Sentinel" },
      { property: "og:description", content: "GSOC situational awareness & OSINT — resource directory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Sentinel tab="directory" />,
});
