import type { Resource } from "./geo-data";

// Each verified record includes its public evidence; no source rating is inferred from outlet identity.
export const WICHITA_RESOURCES: Resource[] = [
  {
    id: "ks-wichita-pd", name: "Wichita Police Department",
    url: "https://www.wichita.gov/Police", scope: "US-KS-WICHITA",
    categories: ["Emergency Services", "Civil Unrest & Security"], reliability: "official",
    organization: "City of Wichita — Wichita Police Department", coverage: "Wichita, Kansas",
    bestUsedFor: "Police public information and eligible non-emergency reports through the Case Desk.",
    sourceClass: "Official Primary Source", verificationStatus: "Verified", lastVerified: "2026-11-15",
    evidenceUrl: "https://www.wichita.gov/Police", lang: "English", section: "Police & Public Safety",
    accessMode: "Static resource",
    phone: { number: "316-268-4221", label: "Case Desk — eligible non-emergency reports (not dispatch)", verified: true, evidenceUrl: "https://www.wichita.gov/844/How-to-Report" },
    note: "Case Desk handles reports that do not require an officer on scene; call 911 for emergencies. Official pages checked through indexed public content; direct automated access was blocked.",
  },
  {
    id: "ks-wichita-fire", name: "Wichita Fire Department",
    url: "https://www.wichita.gov/Fire", scope: "US-KS-WICHITA",
    categories: ["Emergency Services"], reliability: "official",
    organization: "City of Wichita — Wichita Fire Department", coverage: "Wichita, Kansas",
    bestUsedFor: "Fire department administration, fire prevention and fire-report request information.",
    sourceClass: "Official Primary Source", verificationStatus: "Verified", lastVerified: "2026-11-15",
    evidenceUrl: "https://www.wichita.gov/Fire", lang: "English", section: "Fire & Rescue",
    accessMode: "Static resource",
    phone: { number: "316-268-4510", label: "Fire administration — not emergency dispatch", verified: true, evidenceUrl: "https://www.wichita.gov/m/directory/department?did=73" },
    note: "Administrative contact only; call 911 for emergencies. Official pages checked through indexed public content; direct automated access was blocked.",
  },
  {
    id: "ks-ict-nws", name: "NWS Wichita Forecast Office",
    url: "https://www.weather.gov/ict/", scope: "US-KS-WICHITA",
    categories: ["Weather", "Natural Hazards"], reliability: "official",
    organization: "NOAA — National Weather Service", coverage: "Wichita and the NWS Wichita forecast area in Kansas",
    bestUsedFor: "Official forecasts, severe-weather warnings and local weather briefings.",
    sourceClass: "Official Primary Source", verificationStatus: "Verified", lastVerified: "2026-11-15",
    evidenceUrl: "https://www.weather.gov/ict/", lang: "English", section: "Weather & Natural Hazards",
    accessMode: "Static resource",
    phone: { number: "316-942-3102", label: "Forecast office — public inquiries", verified: true, evidenceUrl: "https://www.weather.gov/ict/" },
    note: "External official website with changing forecasts and warnings; not an integrated live feed. Office phone is not emergency dispatch.",
  },
];