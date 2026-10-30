// Live public incident feeds (CORS-enabled, keyless).
export type Severity = "critical" | "caution" | "normal";
export interface Incident {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  type: string;
  lat: number;
  lng: number;
  time: number;
  severity: Severity;
  verified: boolean;
}

export async function fetchUSGS(): Promise<Incident[]> {
  const r = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson");
  if (!r.ok) throw new Error("USGS feed unavailable");
  const j = await r.json();
  return j.features.map((f: any) => {
    const m = f.properties.mag ?? 0;
    return {
      id: `usgs-${f.id}`,
      title: f.properties.title,
      source: "USGS",
      sourceUrl: f.properties.url,
      type: "Earthquake",
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
      time: f.properties.time,
      severity: m >= 6 ? "critical" : m >= 4.5 ? "caution" : "normal",
      verified: f.properties.status === "reviewed",
    } satisfies Incident;
  });
}

export async function fetchEONET(): Promise<Incident[]> {
  const r = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30&limit=300");
  if (!r.ok) throw new Error("NASA EONET feed unavailable");
  const j = await r.json();
  const out: Incident[] = [];
  for (const e of j.events) {
    const g = e.geometry?.[e.geometry.length - 1];
    if (!g || g.type !== "Point") continue;
    const cat = e.categories?.[0]?.title ?? "Event";
    out.push({
      id: `eonet-${e.id}`,
      title: e.title,
      source: "NASA EONET",
      sourceUrl: e.sources?.[0]?.url ?? e.link,
      type: cat,
      lng: g.coordinates[0],
      lat: g.coordinates[1],
      time: Date.parse(g.date),
      severity: /storm|volcano/i.test(cat) ? "caution" : "normal",
      verified: true,
    });
  }
  return out;
}

export interface GeoHit {
  name: string;
  display: string;
  lat: number;
  lng: number;
  bbox?: [number, number, number, number];
  countryCode?: string;
  type: string;
}

/** Worldwide place search (OpenStreetMap Nominatim). */
export async function searchPlaces(q: string): Promise<GeoHit[]> {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`,
    { headers: { "Accept-Language": "en" } },
  );
  if (!r.ok) return [];
  const j = await r.json();
  return j.map((h: any) => ({
    name: h.name || h.display_name.split(",")[0],
    display: h.display_name,
    lat: +h.lat,
    lng: +h.lon,
    bbox: h.boundingbox ? [+h.boundingbox[2], +h.boundingbox[0], +h.boundingbox[3], +h.boundingbox[1]] : undefined,
    countryCode: h.address?.country_code?.toUpperCase(),
    type: h.addresstype ?? h.type,
  }));
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, t = Math.PI / 180;
  const dLat = (b.lat - a.lat) * t, dLng = (b.lng - a.lng) * t;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
