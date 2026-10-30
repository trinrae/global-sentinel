import { createFileRoute } from "@tanstack/react-router";
import { Sentinel } from "@/components/Sentinel";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Live Monitoring | Global Sentinel" },
      { name: "description", content: "Global Sentinel Live Monitoring: GSOC situational awareness and OSINT for employee, traveler and office safety." },
      { property: "og:title", content: "Live Monitoring | Global Sentinel" },
      { property: "og:description", content: "GSOC situational awareness & OSINT — live monitoring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Sentinel tab="incidents" live />,
});
