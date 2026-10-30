import { describe, expect, it } from "vitest";
import { BASE_LOCATIONS, lineage, resourcesFor } from "@/lib/geo-data";

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
});
