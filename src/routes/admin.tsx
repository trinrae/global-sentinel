import { createFileRoute } from "@tanstack/react-router";
import { Sentinel } from "@/components/Sentinel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration | Global Sentinel" },
      { name: "description", content: "Global Sentinel Administration: GSOC situational awareness and OSINT for employee, traveler and office safety." },
      { property: "og:title", content: "Administration | Global Sentinel" },
      { property: "og:description", content: "GSOC situational awareness & OSINT — administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Sentinel tab="admin" />,
});
