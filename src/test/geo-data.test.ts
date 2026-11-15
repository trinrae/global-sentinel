import { describe, expect, it } from "vitest";
import { BASE_LOCATIONS, lineage, resourcesFor } from "@/lib/geo-data";
import { operationalPhone, sourceClassification, sectionResources } from "@/lib/resource-verification";
import type { Resource } from "@/lib/geo-data";

describe("geographic hierarchy", () => {
  it("Wichita resolves to Wichita → Sedgwick County → Kansas → United States", () => {
    expect(lineage("US-KS-WICHITA", BASE_LOCATIONS).map((l) => l.name)).toEqual([
      "Wichita",
      "Sedgwick County",
      "Kansas",
      "United States",
    ]);
  });

  it("Madrid includes Spanish national resources plus Madrid-specific ones", () => {
    const madrid = resourcesFor("ES-MD-MAD", BASE_LOCATIONS).map((r) => r.id);
    const spain = resourcesFor("ES", BASE_LOCATIONS).map((r) => r.id);
    expect(madrid).toContain("es-aemet");
    expect(madrid).toContain("es-mad-ayto");
    expect(spain).not.toContain("es-mad-ayto");
  });

  it("returns no duplicate resource URLs", () => {
    const urls = resourcesFor("US-KS-WICHITA", BASE_LOCATIONS).map((r) => r.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("search shortcuts are never classified as verified news outlets", () => {
    const search = resourcesFor("US-KS-WICHITA", BASE_LOCATIONS).find((r) => r.id === "gen-gn-US-KS-WICHITA");
    expect(search).toBeDefined();
    if (search) expect(sourceClassification(search)).toBe("External Search Shortcut");
  });

  it("unverified contacts cannot be offered as operational phone numbers", () => {
    const r: Resource = { id: "pending", name: "Pending", url: "https://example.org", scope: "US-KS-WICHITA", categories: ["Emergency Services"], reliability: "official", verificationStatus: "Needs Verification", phone: { number: "000", label: "Pending", verified: true, evidenceUrl: "https://example.org" } };
    expect(operationalPhone(r)).toBeUndefined();
  });

  it("a news rating requires documentary evidence", () => {
    const r: Resource = { id: "news", name: "Unrated", url: "https://example.org", scope: "US-KS-WICHITA", categories: ["News – Local"], reliability: "verified", sourceClass: "Independently Rated News Source" };
    expect(sourceClassification(r)).toBe("Unrated News Source");
  });

  it("national and global sources stay available in Wichita intelligence", () => {
    const ids = sectionResources("National & Global Resources", resourcesFor("US-KS-WICHITA", BASE_LOCATIONS)).map((r) => r.id);
    expect(ids).toContain("us-fema");
    expect(ids).toContain("g-usgs");
  });

  it("Wichita exposes the documented police Case Desk number without treating it as dispatch", () => {
    const police = resourcesFor("US-KS-WICHITA", BASE_LOCATIONS).find((r) => r.id === "ks-wichita-pd");
    expect(police).toBeDefined();
    if (!police) throw new Error("Wichita police missing");
    expect(sourceClassification(police)).toBe("Official Primary Source");
    expect(operationalPhone(police)?.number).toBe("316-268-4221");
    expect(operationalPhone(police)?.evidenceUrl).toBe("https://www.wichita.gov/844/How-to-Report");
  });

  it("Wichita fire includes its documented administration contact", () => {
    const fire = resourcesFor("US-KS-WICHITA", BASE_LOCATIONS).find((r) => r.id === "ks-wichita-fire");
    if (!fire) throw new Error("Wichita fire missing");
    expect(operationalPhone(fire)?.number).toBe("316-268-4510");
    expect(sectionResources("Fire & Rescue", [fire])).toEqual([fire]);
  });

  it("NWS Wichita retains its documented office phone and static access classification", () => {
    const weather = resourcesFor("US-KS-WICHITA", BASE_LOCATIONS).find((r) => r.id === "ks-ict-nws");
    if (!weather) throw new Error("Wichita NWS missing");
    expect(operationalPhone(weather)?.number).toBe("316-942-3102");
    expect(weather.accessMode).toBe("Static resource");
  });
});
