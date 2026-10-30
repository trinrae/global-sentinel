import { createFileRoute } from "@tanstack/react-router";
import { Sentinel } from "@/components/Sentinel";

export const Route = createFileRoute("/regional")({
  head: () => ({
    meta: [
      { title: "Regional Watch | Global Sentinel" },
      { name: "description", content: "Global Sentinel Regional Watch: GSOC situational awareness and OSINT for employee, traveler and office safety." },
      { property: "og:title", content: "Regional Watch | Global Sentinel" },
      { property: "og:description", content: "GSOC situational awareness & OSINT — regional watch." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Sentinel tab="watch" />,
});
