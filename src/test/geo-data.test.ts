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
});
