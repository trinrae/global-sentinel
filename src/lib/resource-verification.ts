import { CATEGORIES, type Resource } from "./geo-data";

export function sourceClassification(r: Resource): NonNullable<Resource["sourceClass"]> {
  if (r.accessMode === "External Search Shortcut" || /^(gen-gn-|gen-x-|gen-osm-)/.test(r.id)) return "External Search Shortcut";
  if (r.sourceClass === "Independently Rated News Source" && !r.ratingEvidenceUrl) return "Unrated News Source";
  if (r.sourceClass === "Official Primary Source" && !isVerified(r)) return "Unverified Resource";
  if (r.sourceClass) return r.sourceClass;
  if (r.categories.some((c) => c.startsWith("News"))) return "Unrated News Source";
  return "Unverified Resource";
}

export function isVerified(r: Resource) {
  return r.verificationStatus === "Verified" && Boolean(r.evidenceUrl && r.lastVerified);
}

export function operationalPhone(r: Resource) {
  return isVerified(r) && r.phone?.verified && r.phone.evidenceUrl ? r.phone : undefined;
}

export function accessMode(r: Resource) {
  return sourceClassification(r) === "External Search Shortcut" ? "External Search Shortcut" : r.accessMode ?? "Static resource";
}

export const INTEL_SECTIONS = ["Emergency Contacts", "Police & Public Safety", "Fire & Rescue", "Emergency Management", "Weather & Natural Hazards", "Local News", "Social Intelligence", "Transportation", "National & Global Resources"] as const;

export function sectionResources(section: typeof INTEL_SECTIONS[number], resources: Resource[]) {
  if (section === "Emergency Contacts") return resources.filter((r) => operationalPhone(r));
  if (section === "National & Global Resources") return resources.filter((r) => r.scope === "US" || r.scope === "GLOBAL");
  const local = resources.filter((r) => r.scope !== "US" && r.scope !== "GLOBAL");
  if (section === "Social Intelligence") return local.filter((r) => r.categories.includes("Social Media") || r.socialAccounts?.length);
  if (section === "Local News") return local.filter((r) => r.section === section || r.categories.includes("News – Local"));
  return local.filter((r) => r.section === section);
}

/** Stable within-category ordering preserves the most-specific-first inherited input. */
export function groupByCategory(resources: Resource[]) {
  return [...resources].sort((a, b) => CATEGORIES.indexOf(a.categories[0] ?? "Translation & Tools") - CATEGORIES.indexOf(b.categories[0] ?? "Translation & Tools"));
}