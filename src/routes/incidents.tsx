import { createFileRoute } from "@tanstack/react-router";
import { Sentinel } from "@/components/Sentinel";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incident Explorer | Global Sentinel" },
      { name: "description", content: "Global Sentinel Incident Explorer: GSOC situational awareness and OSINT for employee, traveler and office safety." },
      { property: "og:title", content: "Incident Explorer | Global Sentinel" },
      { property: "og:description", content: "GSOC situational awareness & OSINT — incident explorer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Sentinel tab="incidents" />,
});
