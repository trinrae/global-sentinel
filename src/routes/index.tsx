import { createFileRoute } from "@tanstack/react-router";
import { Sentinel } from "@/components/Sentinel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Global Overview | Global Sentinel" },
      { name: "description", content: "Global Sentinel Global Overview: GSOC situational awareness and OSINT for employee, traveler and office safety." },
      { property: "og:title", content: "Global Overview | Global Sentinel" },
      { property: "og:description", content: "GSOC situational awareness & OSINT — global overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Sentinel tab="directory" />,
});
