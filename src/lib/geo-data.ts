// Geographic hierarchy + resource directory. Browser-safe, no side effects.
export type Region = "AMER" | "EMEA" | "APAC";
export type LocType = "country" | "admin1" | "admin2" | "city";

export interface GeoLoc {
  id: string;
  name: string;
  type: LocType;
  parent?: string;
  lat: number;
  lng: number;
  zoom: number;
  region: Region;
  /** Local term for this admin level, e.g. "State", "Autonomous Community", "Kraj" */
  label?: string;
  priority?: boolean;
  watch?: boolean;
}

export interface Country {
  code: string;
  name: string;
  region: Region;
  lat: number;
  lng: number;
  zoom: number;
  emergency: string; // general
  police?: string;
  ambulance?: string;
  fire?: string;
  lang: string; // ISO lang for news + translate
  gl: string; // google news locale code
}

export const COUNTRIES: Country[] = [
  // AMER
  { code: "US", name: "United States", region: "AMER", lat: 39.8, lng: -98.6, zoom: 3.3, emergency: "911", lang: "en", gl: "US" },
  { code: "CA", name: "Canada", region: "AMER", lat: 56.1, lng: -106.3, zoom: 2.8, emergency: "911", lang: "en", gl: "CA" },
  { code: "MX", name: "Mexico", region: "AMER", lat: 23.6, lng: -102.5, zoom: 4.2, emergency: "911", lang: "es", gl: "MX" },
  { code: "CR", name: "Costa Rica", region: "AMER", lat: 9.75, lng: -83.75, zoom: 6.8, emergency: "911", lang: "es", gl: "CR" },
  { code: "GT", name: "Guatemala", region: "AMER", lat: 15.8, lng: -90.2, zoom: 6.6, emergency: "110", police: "110", fire: "122", ambulance: "128", lang: "es", gl: "GT" },
  { code: "CO", name: "Colombia", region: "AMER", lat: 4.6, lng: -74.3, zoom: 4.8, emergency: "123", lang: "es", gl: "CO" },
  { code: "PE", name: "Peru", region: "AMER", lat: -9.2, lng: -75.0, zoom: 4.8, emergency: "105", police: "105", fire: "116", ambulance: "106", lang: "es", gl: "PE" },
  { code: "BR", name: "Brazil", region: "AMER", lat: -14.2, lng: -51.9, zoom: 3.4, emergency: "190", police: "190", fire: "193", ambulance: "192", lang: "pt", gl: "BR" },
  { code: "AR", name: "Argentina", region: "AMER", lat: -38.4, lng: -63.6, zoom: 3.6, emergency: "911", police: "911", fire: "100", ambulance: "107", lang: "es", gl: "AR" },
  // EMEA
  { code: "ES", name: "Spain", region: "EMEA", lat: 40.4, lng: -3.7, zoom: 5.3, emergency: "112", lang: "es", gl: "ES" },
  { code: "PT", name: "Portugal", region: "EMEA", lat: 39.4, lng: -8.2, zoom: 6, emergency: "112", lang: "pt", gl: "PT" },
  { code: "IE", name: "Ireland", region: "EMEA", lat: 53.4, lng: -8.2, zoom: 6, emergency: "112 / 999", lang: "en", gl: "IE" },
  { code: "GB", name: "United Kingdom", region: "EMEA", lat: 54.0, lng: -2.5, zoom: 5, emergency: "999 / 112", lang: "en", gl: "GB" },
  { code: "FR", name: "France", region: "EMEA", lat: 46.6, lng: 2.2, zoom: 5.2, emergency: "112", police: "17", fire: "18", ambulance: "15", lang: "fr", gl: "FR" },
  { code: "CH", name: "Switzerland", region: "EMEA", lat: 46.8, lng: 8.2, zoom: 7, emergency: "112", police: "117", fire: "118", ambulance: "144", lang: "de", gl: "CH" },
  { code: "IT", name: "Italy", region: "EMEA", lat: 42.5, lng: 12.6, zoom: 5.2, emergency: "112", lang: "it", gl: "IT" },
  { code: "AT", name: "Austria", region: "EMEA", lat: 47.5, lng: 14.6, zoom: 6.5, emergency: "112", police: "133", fire: "122", ambulance: "144", lang: "de", gl: "AT" },
  { code: "HU", name: "Hungary", region: "EMEA", lat: 47.2, lng: 19.5, zoom: 6.5, emergency: "112", lang: "hu", gl: "HU" },
  { code: "RO", name: "Romania", region: "EMEA", lat: 45.9, lng: 25.0, zoom: 6, emergency: "112", lang: "ro", gl: "RO" },
  { code: "PL", name: "Poland", region: "EMEA", lat: 51.9, lng: 19.1, zoom: 5.6, emergency: "112", police: "997", fire: "998", ambulance: "999", lang: "pl", gl: "PL" },
  { code: "CZ", name: "Czechia", region: "EMEA", lat: 49.8, lng: 15.5, zoom: 6.5, emergency: "112", police: "158", fire: "150", ambulance: "155", lang: "cs", gl: "CZ" },
  { code: "DE", name: "Germany", region: "EMEA", lat: 51.2, lng: 10.4, zoom: 5.5, emergency: "112", police: "110", lang: "de", gl: "DE" },
  { code: "BE", name: "Belgium", region: "EMEA", lat: 50.5, lng: 4.5, zoom: 7, emergency: "112", police: "101", lang: "nl", gl: "BE" },
  { code: "NL", name: "Netherlands", region: "EMEA", lat: 52.1, lng: 5.3, zoom: 7, emergency: "112", lang: "nl", gl: "NL" },
  { code: "DK", name: "Denmark", region: "EMEA", lat: 56.0, lng: 10.0, zoom: 6, emergency: "112", lang: "da", gl: "DK" },
  { code: "NO", name: "Norway", region: "EMEA", lat: 64.5, lng: 12.0, zoom: 4.2, emergency: "112", police: "112", fire: "110", ambulance: "113", lang: "no", gl: "NO" },
  { code: "SE", name: "Sweden", region: "EMEA", lat: 62.0, lng: 15.0, zoom: 4.3, emergency: "112", lang: "sv", gl: "SE" },
  { code: "FI", name: "Finland", region: "EMEA", lat: 64.0, lng: 26.0, zoom: 4.5, emergency: "112", lang: "fi", gl: "FI" },
  { code: "EE", name: "Estonia", region: "EMEA", lat: 58.6, lng: 25.0, zoom: 6.5, emergency: "112", lang: "et", gl: "EE" },
  { code: "IS", name: "Iceland", region: "EMEA", lat: 64.9, lng: -19.0, zoom: 5.5, emergency: "112", lang: "is", gl: "IS" },
  { code: "GR", name: "Greece", region: "EMEA", lat: 39.1, lng: 22.9, zoom: 5.8, emergency: "112", police: "100", fire: "199", ambulance: "166", lang: "el", gl: "GR" },
  { code: "IL", name: "Israel", region: "EMEA", lat: 31.5, lng: 34.9, zoom: 6.8, emergency: "100", police: "100", fire: "102", ambulance: "101", lang: "he", gl: "IL" },
  { code: "SA", name: "Saudi Arabia", region: "EMEA", lat: 23.9, lng: 45.1, zoom: 4.5, emergency: "911", lang: "ar", gl: "SA" },
  { code: "AE", name: "United Arab Emirates", region: "EMEA", lat: 24.3, lng: 54.4, zoom: 6.5, emergency: "999", police: "999", fire: "997", ambulance: "998", lang: "ar", gl: "AE" },
  { code: "ZA", name: "South Africa", region: "EMEA", lat: -29.0, lng: 24.7, zoom: 4.8, emergency: "112 (mobile)", police: "10111", ambulance: "10177", lang: "en", gl: "ZA" },
  { code: "JO", name: "Jordan", region: "EMEA", lat: 31.2, lng: 36.5, zoom: 6.5, emergency: "911", lang: "ar", gl: "JO" },
  // APAC
  { code: "IN", name: "India", region: "APAC", lat: 21.0, lng: 78.9, zoom: 4, emergency: "112", police: "100", fire: "101", ambulance: "102", lang: "hi", gl: "IN" },
  { code: "TH", name: "Thailand", region: "APAC", lat: 15.9, lng: 100.9, zoom: 5, emergency: "191", police: "191", fire: "199", ambulance: "1669", lang: "th", gl: "TH" },
  { code: "CN", name: "China", region: "APAC", lat: 35.9, lng: 104.2, zoom: 3.5, emergency: "110", police: "110", fire: "119", ambulance: "120", lang: "zh-CN", gl: "CN" },
  { code: "TW", name: "Taiwan", region: "APAC", lat: 23.7, lng: 121.0, zoom: 6.5, emergency: "110 / 119", police: "110", fire: "119", ambulance: "119", lang: "zh-TW", gl: "TW" },
  { code: "SG", name: "Singapore", region: "APAC", lat: 1.35, lng: 103.82, zoom: 10, emergency: "999 / 995", police: "999", fire: "995", ambulance: "995", lang: "en", gl: "SG" },
  { code: "VN", name: "Vietnam", region: "APAC", lat: 14.1, lng: 108.3, zoom: 5, emergency: "113", police: "113", fire: "114", ambulance: "115", lang: "vi", gl: "VN" },
  { code: "PH", name: "Philippines", region: "APAC", lat: 12.9, lng: 121.8, zoom: 5, emergency: "911", lang: "tl", gl: "PH" },
  { code: "JP", name: "Japan", region: "APAC", lat: 36.2, lng: 138.3, zoom: 4.8, emergency: "110 / 119", police: "110", fire: "119", ambulance: "119", lang: "ja", gl: "JP" },
  { code: "KR", name: "South Korea", region: "APAC", lat: 36.5, lng: 127.9, zoom: 6, emergency: "112 / 119", police: "112", fire: "119", ambulance: "119", lang: "ko", gl: "KR" },
  { code: "AU", name: "Australia", region: "APAC", lat: -25.3, lng: 133.8, zoom: 3.6, emergency: "000", lang: "en", gl: "AU" },
  { code: "NZ", name: "New Zealand", region: "APAC", lat: -41.0, lng: 174.0, zoom: 5, emergency: "111", lang: "en", gl: "NZ" },
];

const sub: GeoLoc[] = [
  { id: "US-KS", name: "Kansas", type: "admin1", parent: "US", lat: 38.5, lng: -98.4, zoom: 6.3, region: "AMER", label: "State" },
  { id: "US-KS-SEDGWICK", name: "Sedgwick County", type: "admin2", parent: "US-KS", lat: 37.68, lng: -97.46, zoom: 9, region: "AMER", label: "County" },
  { id: "US-KS-WICHITA", name: "Wichita", type: "city", parent: "US-KS-SEDGWICK", lat: 37.687, lng: -97.33, zoom: 11, region: "AMER", priority: true },
  { id: "US-NY", name: "New York", type: "admin1", parent: "US", lat: 42.9, lng: -75.5, zoom: 6, region: "AMER", label: "State" },
  { id: "US-NY-NYC", name: "New York City", type: "city", parent: "US-NY", lat: 40.71, lng: -74.0, zoom: 10.5, region: "AMER" },
  { id: "US-CA", name: "California", type: "admin1", parent: "US", lat: 37.2, lng: -119.4, zoom: 5.3, region: "AMER", label: "State" },
  { id: "US-CA-SF", name: "San Francisco", type: "city", parent: "US-CA", lat: 37.77, lng: -122.42, zoom: 11.5, region: "AMER" },
  { id: "MX-CMX", name: "Mexico City", type: "city", parent: "MX", lat: 19.43, lng: -99.13, zoom: 10, region: "AMER" },
  { id: "CO-BOG", name: "Bogotá", type: "city", parent: "CO", lat: 4.71, lng: -74.07, zoom: 10.5, region: "AMER" },
  { id: "BR-SP", name: "São Paulo (State)", type: "admin1", parent: "BR", lat: -22.2, lng: -48.7, zoom: 6, region: "AMER", label: "State" },
  { id: "BR-SP-SAO", name: "São Paulo", type: "city", parent: "BR-SP", lat: -23.55, lng: -46.63, zoom: 10, region: "AMER" },
  { id: "ES-MD", name: "Comunidad de Madrid", type: "admin1", parent: "ES", lat: 40.42, lng: -3.7, zoom: 8, region: "EMEA", label: "Autonomous Community" },
  { id: "ES-MD-MAD", name: "Madrid", type: "city", parent: "ES-MD", lat: 40.4168, lng: -3.7038, zoom: 11, region: "EMEA" },
  { id: "ES-CT", name: "Catalonia", type: "admin1", parent: "ES", lat: 41.8, lng: 1.5, zoom: 7.3, region: "EMEA", label: "Autonomous Community" },
  { id: "ES-CT-BCN", name: "Barcelona", type: "city", parent: "ES-CT", lat: 41.39, lng: 2.17, zoom: 11, region: "EMEA" },
  { id: "GB-LND", name: "London", type: "city", parent: "GB", lat: 51.507, lng: -0.128, zoom: 10, region: "EMEA" },
  { id: "FR-IDF", name: "Île-de-France", type: "admin1", parent: "FR", lat: 48.7, lng: 2.5, zoom: 8, region: "EMEA", label: "Région" },
  { id: "FR-IDF-PAR", name: "Paris", type: "city", parent: "FR-IDF", lat: 48.857, lng: 2.352, zoom: 11, region: "EMEA" },
  { id: "CZ-PHA", name: "Prague", type: "city", parent: "CZ", lat: 50.0755, lng: 14.4378, zoom: 11, region: "EMEA", priority: true, label: "Capital City (Kraj)" },
  { id: "DE-BE", name: "Berlin", type: "city", parent: "DE", lat: 52.52, lng: 13.405, zoom: 10.5, region: "EMEA" },
  { id: "ZA-GP", name: "Gauteng", type: "admin1", parent: "ZA", lat: -26.27, lng: 28.11, zoom: 8, region: "EMEA", label: "Province" },
  { id: "ZA-GP-JNB", name: "Johannesburg", type: "city", parent: "ZA-GP", lat: -26.2041, lng: 28.0473, zoom: 10.5, region: "EMEA", priority: true },
  { id: "AE-DU-DXB", name: "Dubai", type: "city", parent: "AE", lat: 25.2, lng: 55.27, zoom: 10, region: "EMEA", label: "Emirate" },
  { id: "IL-TLV", name: "Tel Aviv", type: "city", parent: "IL", lat: 32.085, lng: 34.78, zoom: 11, region: "EMEA" },
  { id: "IN-KA", name: "Karnataka", type: "admin1", parent: "IN", lat: 15.3, lng: 75.7, zoom: 6, region: "APAC", label: "State" },
  { id: "IN-KA-BLR", name: "Bengaluru", type: "city", parent: "IN-KA", lat: 12.97, lng: 77.59, zoom: 10.5, region: "APAC" },
  { id: "IN-MH-MUM", name: "Mumbai", type: "city", parent: "IN", lat: 19.076, lng: 72.877, zoom: 10.5, region: "APAC" },
  { id: "JP-13-TYO", name: "Tokyo", type: "city", parent: "JP", lat: 35.68, lng: 139.69, zoom: 10, region: "APAC", label: "Metropolis (To)" },
  { id: "SG-SIN", name: "Singapore City", type: "city", parent: "SG", lat: 1.29, lng: 103.85, zoom: 12, region: "APAC" },
  { id: "AU-NSW", name: "New South Wales", type: "admin1", parent: "AU", lat: -32.0, lng: 147.0, zoom: 5.5, region: "APAC", label: "State" },
  { id: "AU-NSW-SYD", name: "Sydney", type: "city", parent: "AU-NSW", lat: -33.87, lng: 151.21, zoom: 10.5, region: "APAC" },
];

export const BASE_LOCATIONS: GeoLoc[] = [
  ...COUNTRIES.map((c) => ({ id: c.code, name: c.name, type: "country" as const, lat: c.lat, lng: c.lng, zoom: c.zoom, region: c.region })),
  ...sub,
];

export function countryOf(loc: GeoLoc, all: GeoLoc[]): Country | undefined {
  let cur: GeoLoc | undefined = loc;
  while (cur && cur.type !== "country") cur = all.find((l) => l.id === cur!.parent);
  return cur ? COUNTRIES.find((c) => c.code === cur!.id) : undefined;
}

/** Location plus every ancestor, most specific first. */
export function lineage(id: string, all: GeoLoc[]): GeoLoc[] {
  const out: GeoLoc[] = [];
  let cur = all.find((l) => l.id === id);
  while (cur) {
    out.push(cur);
    cur = cur.parent ? all.find((l) => l.id === cur!.parent) : undefined;
  }
  return out;
}

// ---------------- Resource taxonomy ----------------
export const CATEGORIES = [
  "Emergency Services",
  "Government & Advisories",
  "Natural Hazards",
  "Weather",
  "Transportation",
  "Public Health",
  "Civil Unrest & Security",
  "News – Local",
  "News – Global",
  "Social Media",
  "Translation & Tools",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Reliability = "official" | "verified" | "unverified";

export interface Resource {
  id: string;
  name: string;
  url: string;
  scope: string; // location id or "GLOBAL"
  categories: Category[];
  reliability: Reliability;
  lang?: string;
  note?: string;
}

const enc = encodeURIComponent;

const GLOBAL: Resource[] = [
  { id: "g-gdacs", name: "GDACS – Global Disaster Alert & Coordination", url: "https://www.gdacs.org/", scope: "GLOBAL", categories: ["Natural Hazards"], reliability: "official" },
  { id: "g-usgs", name: "USGS Earthquake Hazards (live)", url: "https://earthquake.usgs.gov/earthquakes/map/", scope: "GLOBAL", categories: ["Natural Hazards"], reliability: "official" },
  { id: "g-reliefweb", name: "ReliefWeb (UN OCHA)", url: "https://reliefweb.int/", scope: "GLOBAL", categories: ["Natural Hazards", "Public Health", "Civil Unrest & Security"], reliability: "official" },
  { id: "g-who", name: "WHO Disease Outbreak News", url: "https://www.who.int/emergencies/disease-outbreak-news", scope: "GLOBAL", categories: ["Public Health"], reliability: "official" },
  { id: "g-firms", name: "NASA FIRMS – Active Fires", url: "https://firms.modaps.eosdis.nasa.gov/map/", scope: "GLOBAL", categories: ["Natural Hazards"], reliability: "official" },
  { id: "g-flightradar", name: "Flightradar24 – Live Air Traffic", url: "https://www.flightradar24.com/", scope: "GLOBAL", categories: ["Transportation"], reliability: "verified" },
  { id: "g-marinetraffic", name: "MarineTraffic – Vessel Tracking", url: "https://www.marinetraffic.com/", scope: "GLOBAL", categories: ["Transportation"], reliability: "verified" },
  { id: "g-reuters", name: "Reuters World", url: "https://www.reuters.com/world/", scope: "GLOBAL", categories: ["News – Global"], reliability: "verified" },
  { id: "g-ap", name: "AP News – World", url: "https://apnews.com/world-news", scope: "GLOBAL", categories: ["News – Global"], reliability: "verified" },
  { id: "g-bbc", name: "BBC World", url: "https://www.bbc.com/news/world", scope: "GLOBAL", categories: ["News – Global"], reliability: "verified" },
  { id: "g-acled", name: "ACLED – Conflict & Protest Data", url: "https://acleddata.com/", scope: "GLOBAL", categories: ["Civil Unrest & Security"], reliability: "verified" },
  { id: "g-liveua", name: "Liveuamap", url: "https://liveuamap.com/", scope: "GLOBAL", categories: ["Civil Unrest & Security", "Social Media"], reliability: "unverified", note: "Crowd-aggregated; corroborate before acting." },
  { id: "g-windy", name: "Windy – Global Weather", url: "https://www.windy.com/", scope: "GLOBAL", categories: ["Weather"], reliability: "verified" },
  { id: "g-gtranslate", name: "Google Translate", url: "https://translate.google.com/", scope: "GLOBAL", categories: ["Translation & Tools"], reliability: "verified" },
  { id: "g-deepl", name: "DeepL Translator", url: "https://www.deepl.com/translator", scope: "GLOBAL", categories: ["Translation & Tools"], reliability: "verified" },
  { id: "g-timeanddate", name: "World Clock (timeanddate)", url: "https://www.timeanddate.com/worldclock/", scope: "GLOBAL", categories: ["Translation & Tools"], reliability: "verified" },
  { id: "g-osac", name: "OSAC – Overseas Security Advisory Council", url: "https://www.osac.gov/", scope: "GLOBAL", categories: ["Government & Advisories", "Civil Unrest & Security"], reliability: "official" },
];

const SPECIFIC: Resource[] = [
  // United States chain
  { id: "us-fema", name: "FEMA", url: "https://www.fema.gov/", scope: "US", categories: ["Government & Advisories", "Natural Hazards"], reliability: "official" },
  { id: "us-nws", name: "National Weather Service Alerts", url: "https://www.weather.gov/alerts", scope: "US", categories: ["Weather", "Natural Hazards"], reliability: "official" },
  { id: "us-cdc", name: "CDC Health Alert Network", url: "https://emergency.cdc.gov/han/", scope: "US", categories: ["Public Health"], reliability: "official" },
  { id: "us-faa", name: "FAA National Airspace Status", url: "https://nasstatus.faa.gov/", scope: "US", categories: ["Transportation"], reliability: "official" },
  { id: "ks-kdem", name: "Kansas Division of Emergency Management", url: "https://www.kansastag.gov/kdem", scope: "US-KS", categories: ["Government & Advisories", "Emergency Services"], reliability: "official" },
  { id: "ks-kandrive", name: "KanDrive – Road Conditions", url: "https://www.kandrive.gov/", scope: "US-KS", categories: ["Transportation"], reliability: "official" },
  { id: "ks-sedgwick-em", name: "Sedgwick County Emergency Management", url: "https://www.sedgwickcounty.org/emergency-management/", scope: "US-KS-SEDGWICK", categories: ["Emergency Services", "Government & Advisories"], reliability: "official" },
  { id: "ks-wichita-pd", name: "Wichita Police Department", url: "https://www.wichita.gov/WPD", scope: "US-KS-WICHITA", categories: ["Emergency Services", "Civil Unrest & Security"], reliability: "official" },
  { id: "ks-kwch", name: "KWCH 12 News (Wichita)", url: "https://www.kwch.com/", scope: "US-KS-WICHITA", categories: ["News – Local"], reliability: "verified" },
  { id: "ks-ict-nws", name: "NWS Wichita Forecast Office", url: "https://www.weather.gov/ict/", scope: "US-KS-WICHITA", categories: ["Weather"], reliability: "official" },
  { id: "ny-nycem", name: "NYC Emergency Management / Notify NYC", url: "https://www.nyc.gov/site/em/index.page", scope: "US-NY-NYC", categories: ["Emergency Services", "Government & Advisories"], reliability: "official" },
  { id: "ny-mta", name: "MTA Service Status", url: "https://new.mta.info/", scope: "US-NY-NYC", categories: ["Transportation"], reliability: "official" },
  { id: "ca-caloes", name: "Cal OES", url: "https://www.caloes.ca.gov/", scope: "US-CA", categories: ["Government & Advisories", "Natural Hazards"], reliability: "official" },
  { id: "ca-calfire", name: "CAL FIRE Incidents", url: "https://www.fire.ca.gov/incidents", scope: "US-CA", categories: ["Natural Hazards"], reliability: "official" },
  // Spain
  { id: "es-dgpc", name: "Protección Civil (DGPCE)", url: "https://www.proteccioncivil.es/", scope: "ES", categories: ["Government & Advisories", "Emergency Services"], reliability: "official", lang: "es" },
  { id: "es-aemet", name: "AEMET – Avisos Meteorológicos", url: "https://www.aemet.es/es/eltiempo/prediccion/avisos", scope: "ES", categories: ["Weather"], reliability: "official", lang: "es" },
  { id: "es-dgt", name: "DGT – Tráfico en tiempo real", url: "https://infocar.dgt.es/etraffic/", scope: "ES", categories: ["Transportation"], reliability: "official", lang: "es" },
  { id: "es-elpais", name: "El País", url: "https://elpais.com/", scope: "ES", categories: ["News – Local"], reliability: "verified", lang: "es" },
  { id: "es-md-112", name: "Emergencias 112 Comunidad de Madrid", url: "https://x.com/112cmadrid", scope: "ES-MD", categories: ["Emergency Services", "Social Media"], reliability: "official", lang: "es" },
  { id: "es-mad-ayto", name: "Ayuntamiento de Madrid – Emergencias", url: "https://www.madrid.es/portales/munimadrid/es/Inicio/Emergencias-y-seguridad", scope: "ES-MD-MAD", categories: ["Emergency Services", "Government & Advisories"], reliability: "official", lang: "es" },
  { id: "es-mad-emt", name: "EMT Madrid / Metro de Madrid", url: "https://www.metromadrid.es/", scope: "ES-MD-MAD", categories: ["Transportation"], reliability: "official", lang: "es" },
  { id: "es-ct-pc", name: "Protecció Civil Catalunya", url: "https://interior.gencat.cat/ca/arees_dactuacio/proteccio_civil/", scope: "ES-CT", categories: ["Emergency Services", "Government & Advisories"], reliability: "official", lang: "ca" },
  // UK
  { id: "gb-metoffice", name: "Met Office Warnings", url: "https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings", scope: "GB", categories: ["Weather"], reliability: "official" },
  { id: "gb-mi5", name: "UK Threat Level (MI5)", url: "https://www.mi5.gov.uk/threat-levels", scope: "GB", categories: ["Civil Unrest & Security", "Government & Advisories"], reliability: "official" },
  { id: "gb-tfl", name: "TfL Status Updates", url: "https://tfl.gov.uk/tube-dlr-overground/status/", scope: "GB-LND", categories: ["Transportation"], reliability: "official" },
  { id: "gb-met", name: "Metropolitan Police", url: "https://www.met.police.uk/", scope: "GB-LND", categories: ["Emergency Services", "Civil Unrest & Security"], reliability: "official" },
  // France
  { id: "fr-vigi", name: "Vigilance Météo-France", url: "https://vigilance.meteofrance.fr/", scope: "FR", categories: ["Weather"], reliability: "official", lang: "fr" },
  { id: "fr-pp", name: "Préfecture de Police de Paris", url: "https://www.prefecturedepolice.interieur.gouv.fr/", scope: "FR-IDF-PAR", categories: ["Emergency Services", "Civil Unrest & Security"], reliability: "official", lang: "fr" },
  { id: "fr-ratp", name: "RATP Trafic", url: "https://www.ratp.fr/infos-trafic", scope: "FR-IDF-PAR", categories: ["Transportation"], reliability: "official", lang: "fr" },
  // Czechia / Prague
  { id: "cz-hzs", name: "HZS ČR – Fire Rescue Service", url: "https://hzscr.cz/", scope: "CZ", categories: ["Emergency Services", "Natural Hazards"], reliability: "official", lang: "cs" },
  { id: "cz-chmi", name: "ČHMÚ – Weather Warnings", url: "https://www.chmi.cz/", scope: "CZ", categories: ["Weather"], reliability: "official", lang: "cs" },
  { id: "cz-ct24", name: "ČT24", url: "https://ct24.ceskatelevize.cz/", scope: "CZ", categories: ["News – Local"], reliability: "verified", lang: "cs" },
  { id: "cz-pha-police", name: "Policie ČR – Praha", url: "https://policie.gov.cz/krajske-reditelstvi-policie-hlavniho-mesta-prahy.aspx", scope: "CZ-PHA", categories: ["Emergency Services", "Civil Unrest & Security"], reliability: "official", lang: "cs" },
  { id: "cz-pha-dpp", name: "DPP – Prague Public Transit", url: "https://www.dpp.cz/en", scope: "CZ-PHA", categories: ["Transportation"], reliability: "official" },
  { id: "cz-pha-x", name: "Policie ČR Praha on X", url: "https://x.com/PolicieCZ", scope: "CZ-PHA", categories: ["Social Media"], reliability: "official", lang: "cs" },
  { id: "cz-radio-prague", name: "Radio Prague International (English)", url: "https://english.radio.cz/", scope: "CZ-PHA", categories: ["News – Local"], reliability: "verified" },
  // South Africa / Johannesburg
  { id: "za-ndmc", name: "National Disaster Management Centre", url: "https://www.ndmc.gov.za/", scope: "ZA", categories: ["Government & Advisories", "Natural Hazards"], reliability: "official" },
  { id: "za-saws", name: "South African Weather Service", url: "https://www.weathersa.co.za/", scope: "ZA", categories: ["Weather"], reliability: "official" },
  { id: "za-saps", name: "SAPS – South African Police Service", url: "https://www.saps.gov.za/", scope: "ZA", categories: ["Emergency Services", "Civil Unrest & Security"], reliability: "official" },
  { id: "za-eskom", name: "Eskom Load-shedding Status", url: "https://loadshedding.eskom.co.za/", scope: "ZA", categories: ["Government & Advisories"], reliability: "official", note: "Power outages affect security systems & traffic." },
  { id: "za-news24", name: "News24", url: "https://www.news24.com/", scope: "ZA", categories: ["News – Local"], reliability: "verified" },
  { id: "za-gp-i-traffic", name: "i-traffic Gauteng", url: "https://www.i-traffic.co.za/", scope: "ZA-GP", categories: ["Transportation"], reliability: "official" },
  { id: "za-jnb-jmpd", name: "Johannesburg Metro Police (JMPD)", url: "https://x.com/JMPDBlue", scope: "ZA-GP-JNB", categories: ["Emergency Services", "Social Media"], reliability: "official" },
  { id: "za-jnb-ems", name: "City of Joburg EMS", url: "https://www.joburg.org.za/", scope: "ZA-GP-JNB", categories: ["Emergency Services", "Government & Advisories"], reliability: "official" },
  { id: "za-jnb-ewn", name: "Eyewitness News (EWN)", url: "https://ewn.co.za/", scope: "ZA-GP-JNB", categories: ["News – Local"], reliability: "verified" },
  // APAC selections
  { id: "jp-jma", name: "Japan Meteorological Agency – Warnings & Quakes", url: "https://www.jma.go.jp/bosai/en/", scope: "JP", categories: ["Weather", "Natural Hazards"], reliability: "official" },
  { id: "jp-nhk", name: "NHK World", url: "https://www3.nhk.or.jp/nhkworld/", scope: "JP", categories: ["News – Local"], reliability: "verified" },
  { id: "sg-scdf", name: "SCDF", url: "https://www.scdf.gov.sg/", scope: "SG", categories: ["Emergency Services"], reliability: "official" },
  { id: "sg-nea", name: "NEA Weather & Haze", url: "https://www.nea.gov.sg/", scope: "SG", categories: ["Weather", "Public Health"], reliability: "official" },
  { id: "in-ndma", name: "NDMA India", url: "https://ndma.gov.in/", scope: "IN", categories: ["Government & Advisories", "Natural Hazards"], reliability: "official" },
  { id: "in-imd", name: "India Meteorological Department", url: "https://mausam.imd.gov.in/", scope: "IN", categories: ["Weather"], reliability: "official" },
  { id: "au-bom", name: "Bureau of Meteorology Warnings", url: "http://www.bom.gov.au/australia/warnings/", scope: "AU", categories: ["Weather", "Natural Hazards"], reliability: "official" },
  { id: "au-nsw-rfs", name: "NSW Rural Fire Service – Fires Near Me", url: "https://www.rfs.nsw.gov.au/fire-information/fires-near-me", scope: "AU-NSW", categories: ["Natural Hazards"], reliability: "official" },
  { id: "il-hfc", name: "Home Front Command Alerts", url: "https://www.oref.org.il/en", scope: "IL", categories: ["Emergency Services", "Civil Unrest & Security"], reliability: "official" },
  { id: "ph-phivolcs", name: "PHIVOLCS", url: "https://www.phivolcs.dost.gov.ph/", scope: "PH", categories: ["Natural Hazards"], reliability: "official" },
  { id: "tw-cwa", name: "Central Weather Administration", url: "https://www.cwa.gov.tw/eng/", scope: "TW", categories: ["Weather", "Natural Hazards"], reliability: "official" },
];

/** Auto-generated resources for any location (country or below). */
export function generatedResources(loc: GeoLoc, country?: Country): Resource[] {
  const q = loc.type === "country" ? loc.name : `${loc.name} ${country?.name ?? ""}`.trim();
  const out: Resource[] = [
    {
      id: `gen-gn-${loc.id}`,
      name: `Google News – ${loc.name}`,
      url: country
        ? `https://news.google.com/search?q=${enc(q)}&hl=${country.lang}&gl=${country.gl}`
        : `https://news.google.com/search?q=${enc(q)}`,
      scope: loc.id,
      categories: ["News – Local"],
      reliability: "unverified",
      note: "Aggregated search — verify against primary source.",
    },
    {
      id: `gen-x-${loc.id}`,
      name: `X live search – ${loc.name}`,
      url: `https://x.com/search?q=${enc(q + " (police OR fire OR explosion OR protest OR flood)")}&f=live`,
      scope: loc.id,
      categories: ["Social Media"],
      reliability: "unverified",
    },
  ];
  if (loc.type === "country" && country) {
    out.push(
      {
        id: `gen-state-${loc.id}`,
        name: `US State Dept Travel Advisory – ${country.name}`,
        url: `https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html`,
        scope: loc.id,
        categories: ["Government & Advisories"],
        reliability: "official",
      },
      {
        id: `gen-fcdo-${loc.id}`,
        name: `UK FCDO Travel Advice – ${country.name}`,
        url: `https://www.gov.uk/foreign-travel-advice/${country.name.toLowerCase().replace(/ /g, "-")}`,
        scope: loc.id,
        categories: ["Government & Advisories"],
        reliability: "official",
      },
    );
    if (country.lang !== "en")
      out.push({
        id: `gen-tr-${loc.id}`,
        name: `Translate ${country.lang.toUpperCase()} → EN`,
        url: `https://translate.google.com/?sl=${country.lang}&tl=en&op=translate`,
        scope: loc.id,
        categories: ["Translation & Tools"],
        reliability: "verified",
      });
  }
  if (loc.type !== "country") {
    out.push({
      id: `gen-osm-${loc.id}`,
      name: `Reddit search – ${loc.name}`,
      url: `https://www.reddit.com/search/?q=${enc(loc.name)}&sort=new`,
      scope: loc.id,
      categories: ["Social Media"],
      reliability: "unverified",
    });
  }
  return out;
}

export const STATIC_RESOURCES: Resource[] = [...GLOBAL, ...SPECIFIC];

/** Resources for the location and all ancestors + global, deduped by url. */
export function resourcesFor(id: string | null, all: GeoLoc[], extra: Resource[] = []): Resource[] {
  const pool = [...STATIC_RESOURCES, ...extra];
  if (!id) return dedupe(pool.filter((r) => r.scope === "GLOBAL"));
  const chain = lineage(id, all);
  const country = chain[0] ? countryOf(chain[0], all) : undefined;
  const ids = new Set(chain.map((l) => l.id));
  const res: Resource[] = [];
  for (const l of chain) {
    res.push(...pool.filter((r) => r.scope === l.id));
    res.push(...generatedResources(l, country));
  }
  res.push(...pool.filter((r) => r.scope === "GLOBAL"));
  return dedupe(res.filter((r) => r.scope === "GLOBAL" || ids.has(r.scope)));
}

function dedupe(list: Resource[]): Resource[] {
  const seen = new Set<string>();
  return list.filter((r) => (seen.has(r.url) ? false : (seen.add(r.url), true)));
}
