import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BASE_LOCATIONS, CATEGORIES, COUNTRIES, countryOf, lineage, resourcesFor,
  type Category, type GeoLoc, type Region, type Resource,
} from "@/lib/geo-data";
import { fetchEONET, fetchUSGS, haversineKm, searchPlaces, type GeoHit, type Incident } from "@/lib/feeds";
import type { MapHandle, MapStyle } from "./SentinelMap";

const SentinelMap = lazy(() => import("./SentinelMap"));

export type Tab = "directory" | "incidents" | "news" | "watch" | "admin";

const NAV = [
  { to: "/", label: "Global Overview" },
  { to: "/incidents", label: "Incident Explorer" },
  { to: "/monitoring", label: "Live Monitoring" },
  { to: "/news", label: "News & Social Intelligence" },
  { to: "/resources", label: "Resource Directory" },
  { to: "/regional", label: "Regional Watch" },
  { to: "/admin", label: "Administration" },
] as const;

function useStored<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => {
    const s = localStorage.getItem(key);
    if (s) setV(JSON.parse(s));
  }, [key]);
  const set = (n: T) => { setV(n); localStorage.setItem(key, JSON.stringify(n)); };
  return [v, set] as const;
}

export function Sentinel({ tab: initialTab, live = false }: { tab: Tab; live?: boolean }) {
  const mapRef = useRef<MapHandle>(null);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [selected, setSelected] = useState<string | null>(null);
  const [cats, setCats] = useState<Set<Category>>(new Set(CATEGORIES));
  const [region, setRegion] = useState<Region | "ALL">("ALL");
  const [styleName, setStyleName] = useState<MapStyle>("dark");
  const [showInc, setShowInc] = useState(true);
  const [showLoc, setShowLoc] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [bottomOpen, setBottomOpen] = useState(initialTab !== "directory" || true);
  const [watch, setWatch] = useStored<GeoLoc[]>("gs.watch", []);
  const [custom, setCustom] = useStored<Resource[]>("gs.customResources", []);

  const allLocs = useMemo(() => [...BASE_LOCATIONS, ...watch], [watch]);
  const visibleLocs = useMemo(() => allLocs.filter((l) => region === "ALL" || l.region === region), [allLocs, region]);

  const quakes = useQuery({ queryKey: ["usgs"], queryFn: fetchUSGS, refetchInterval: live ? 60_000 : 300_000 });
  const eonet = useQuery({ queryKey: ["eonet"], queryFn: fetchEONET, refetchInterval: live ? 120_000 : 600_000 });
  const incidents = useMemo(() => [...(quakes.data ?? []), ...(eonet.data ?? [])].sort((a, b) => b.time - a.time), [quakes.data, eonet.data]);

  const selLoc = allLocs.find((l) => l.id === selected) ?? null;
  const chain = selected ? lineage(selected, allLocs) : [];
  const country = selLoc ? countryOf(selLoc, allLocs) : undefined;
  const resources = useMemo(
    () => resourcesFor(selected, allLocs, custom).filter((r) => r.categories.some((c) => cats.has(c))),
    [selected, allLocs, custom, cats],
  );
  const nearby = useMemo(() => {
    if (!selLoc) return incidents.slice(0, 50);
    const radius = selLoc.type === "country" ? 1200 : selLoc.type === "admin1" ? 500 : 250;
    return incidents.map((i) => ({ i, d: haversineKm(selLoc, i) })).filter((x) => x.d <= radius).sort((a, b) => a.d - b.d).map((x) => x.i);
  }, [incidents, selLoc]);

  const select = (id: string) => {
    const l = allLocs.find((x) => x.id === id);
    if (!l) return;
    setSelected(id);
    setRightOpen(true);
    mapRef.current?.flyTo(l.lat, l.lng, l.zoom);
  };

  const addFromSearch = (h: GeoHit) => {
    const existingCountry = COUNTRIES.find((c) => c.code === h.countryCode);
    const isCountry = h.type === "country";
    if (isCountry && existingCountry) return select(existingCountry.code);
    const id = `W-${h.countryCode ?? "XX"}-${h.lat.toFixed(3)}-${h.lng.toFixed(3)}`;
    if (!allLocs.find((l) => l.id === id)) {
      const reg: Region = existingCountry?.region ?? (h.lng < -30 ? "AMER" : h.lng > 60 ? "APAC" : "EMEA");
      const loc: GeoLoc = {
        id, name: h.name, type: isCountry ? "country" : "city",
        parent: !isCountry && existingCountry ? existingCountry.code : undefined,
        lat: h.lat, lng: h.lng, zoom: isCountry ? 5 : 10.5, region: reg, watch: true, label: h.type,
      };
      setWatch([...watch, loc]);
    }
    setSelected(id);
    if (h.bbox) mapRef.current?.fitBounds(h.bbox);
    else mapRef.current?.flyTo(h.lat, h.lng, 10);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-6 border-b border-border bg-panel px-4">
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-mono text-sm font-semibold tracking-[0.2em] text-info">GLOBAL SENTINEL</span>
          <span className="hidden text-xs text-muted-foreground xl:inline">| Global Situational Awareness</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="whitespace-nowrap rounded px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${quakes.isError ? "bg-critical" : "bg-ok"}`} />FEEDS</span>
          <UtcClock />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {leftOpen && (
          <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-border bg-panel">
            <LeftPanel
              allLocs={visibleLocs} selected={selected} onSelect={select} onSearchHit={addFromSearch}
              region={region} setRegion={setRegion} cats={cats} setCats={setCats}
            />
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            <ClientOnly fallback={<MapFallback />}>
              <Suspense fallback={<MapFallback />}>
                <SentinelMap ref={mapRef} styleName={styleName} incidents={incidents} locations={visibleLocs}
                  selectedId={selected} showIncidents={showInc} showLocations={showLoc}
                  onSelectLocation={select} onSelectIncident={() => setTab("incidents")} />
              </Suspense>
            </ClientOnly>
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              <div className="flex gap-1 rounded border border-border bg-panel/95 p-1">
                <ToolBtn onClick={() => setLeftOpen(!leftOpen)}>{leftOpen ? "◀" : "▶"} Filters</ToolBtn>
                <ToolBtn onClick={() => { setSelected(null); mapRef.current?.reset(); }}>Reset view</ToolBtn>
                <ToolBtn onClick={() => setRightOpen(!rightOpen)}>Intel {rightOpen ? "▶" : "◀"}</ToolBtn>
              </div>
              <div className="flex flex-col gap-1 rounded border border-border bg-panel/95 p-2 text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Basemap</span>
                <div className="flex gap-1">
                  {(["dark", "positron", "liberty"] as MapStyle[]).map((s) => (
                    <ToolBtn key={s} active={styleName === s} onClick={() => setStyleName(s)}>{s === "positron" ? "light" : s === "liberty" ? "streets" : s}</ToolBtn>
                  ))}
                </div>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Layers</span>
                <label className="flex items-center gap-2"><input type="checkbox" checked={showInc} onChange={(e) => setShowInc(e.target.checked)} />Live incidents ({incidents.length})</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={showLoc} onChange={(e) => setShowLoc(e.target.checked)} />Footprint & watch</label>
              </div>
            </div>
            <Legend />
          </div>

          <section className={`shrink-0 border-t border-border bg-panel ${bottomOpen ? "h-[36vh]" : "h-9"} flex flex-col`}>
            <div className="flex h-9 shrink-0 items-center gap-1 border-b border-border px-2">
              {([["directory", `Resource Directory (${resources.length})`], ["incidents", `Incidents (${nearby.length})`], ["news", "News & Social"], ["watch", `Regional Watch (${watch.length})`], ["admin", "Administration"]] as [Tab, string][]).map(([k, l]) => (
                <button key={k} onClick={() => { setTab(k); setBottomOpen(true); }}
                  className={`rounded px-2.5 py-1 text-xs ${tab === k && bottomOpen ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
              ))}
              <span className="ml-3 truncate text-[11px] text-muted-foreground">{selLoc ? `Scope: ${chain.map((c) => c.name).join(" › ")}` : "Scope: Global"}</span>
              <button onClick={() => setBottomOpen(!bottomOpen)} className="ml-auto px-2 text-xs text-muted-foreground hover:text-foreground">{bottomOpen ? "▾ Collapse" : "▴ Expand"}</button>
            </div>
            {bottomOpen && (
              <div className="min-h-0 flex-1 overflow-auto">
                {tab === "directory" && <DirectoryTable resources={resources} allLocs={allLocs} />}
                {tab === "incidents" && <IncidentTable list={nearby} loading={quakes.isLoading || eonet.isLoading} errored={quakes.isError || eonet.isError} onGo={(i) => mapRef.current?.flyTo(i.lat, i.lng, 8)} selLoc={selLoc} />}
                {tab === "news" && <NewsSocial loc={selLoc} chain={chain} country={country} resources={resources} />}
                {tab === "watch" && <WatchList watch={watch} onRemove={(id) => { setWatch(watch.filter((w) => w.id !== id)); if (selected === id) setSelected(null); }} onSelect={select} />}
                {tab === "admin" && <Admin custom={custom} setCustom={setCustom} allLocs={allLocs} />}
              </div>
            )}
          </section>
        </main>

        {rightOpen && (
          <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-panel">
            <IntelPanel loc={selLoc} chain={chain} country={country} resources={resources} nearby={nearby} onSelect={select} />
          </aside>
        )}
      </div>
    </div>
  );
}

function UtcClock() {
  const [t, setT] = useState<string>("--:--:-- UTC");
  useEffect(() => {
    const f = () => setT(new Date().toISOString().slice(11, 19) + " UTC");
    f();
    const i = setInterval(f, 1000);
    return () => clearInterval(i);
  }, []);
  return <span>{t}</span>;
}

function MapFallback() {
  return <div className="flex h-full items-center justify-center bg-background font-mono text-xs text-muted-foreground">Loading map…</div>;
}

function ToolBtn({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return <button onClick={onClick} className={`rounded px-2 py-1 text-[11px] ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}>{children}</button>;
}

function Legend() {
  return (
    <div className="absolute bottom-8 right-3 flex gap-3 rounded border border-border bg-panel/95 px-3 py-1.5 text-[11px]">
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-critical" />Critical</span>
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-caution" />Caution</span>
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-info" />Normal</span>
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-ok" />Footprint</span>
    </div>
  );
}

export function RelBadge({ r }: { r: Resource["reliability"] }) {
  const cls = r === "official" ? "bg-ok/15 text-ok border-ok/40" : r === "verified" ? "bg-info/15 text-info border-info/40" : "bg-caution/15 text-caution border-caution/40";
  return <span className={`rounded border px-1.5 py-px font-mono text-[10px] uppercase ${cls}`}>{r}</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{children}</h3>;
}

function LeftPanel(p: {
  allLocs: GeoLoc[]; selected: string | null; onSelect: (id: string) => void; onSearchHit: (h: GeoHit) => void;
  region: Region | "ALL"; setRegion: (r: Region | "ALL") => void; cats: Set<Category>; setCats: (s: Set<Category>) => void;
}) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<GeoHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const local = q.length > 1 ? p.allLocs.filter((l) => l.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];

  useEffect(() => {
    if (q.length < 3) { setHits([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try { setHits(await searchPlaces(q)); } finally { setSearching(false); }
    }, 450);
    return () => clearTimeout(t);
  }, [q]);

  const countries = p.allLocs.filter((l) => l.type === "country");
  const children = (id: string) => p.allLocs.filter((l) => l.parent === id);
  const toggle = (id: string) => { const n = new Set(open); n.has(id) ? n.delete(id) : n.add(id); setOpen(n); };

  const renderNode = (l: GeoLoc, depth: number): React.ReactNode => {
    const kids = children(l.id);
    return (
      <div key={l.id}>
        <div className={`flex items-center gap-1 rounded py-0.5 pr-1 text-xs ${p.selected === l.id ? "bg-primary/20 text-foreground" : "text-foreground/85 hover:bg-accent"}`} style={{ paddingLeft: 4 + depth * 12 }}>
          <button className="w-4 text-muted-foreground" onClick={() => kids.length && toggle(l.id)}>{kids.length ? (open.has(l.id) ? "▾" : "▸") : "·"}</button>
          <button className="flex-1 truncate text-left" onClick={() => p.onSelect(l.id)}>{l.name}</button>
          {l.priority && <span className="font-mono text-[9px] text-info">PRIORITY</span>}
          {l.watch && <span className="font-mono text-[9px] text-caution">WATCH</span>}
          {l.label && depth > 0 && <span className="text-[9px] text-muted-foreground">{l.label}</span>}
        </div>
        {open.has(l.id) && kids.map((k) => renderNode(k, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="relative">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search any country, state, county, city…"
          className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring" />
        {(local.length > 0 || hits.length > 0 || searching) && (
          <div className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded border border-border bg-popover text-xs shadow-lg">
            {local.map((l) => (
              <button key={l.id} onClick={() => { p.onSelect(l.id); setQ(""); }} className="block w-full px-2.5 py-1.5 text-left hover:bg-accent">
                <span className="text-foreground">{l.name}</span> <span className="text-[10px] text-ok">· in directory</span>
              </button>
            ))}
            {hits.map((h, i) => (
              <button key={i} onClick={() => { p.onSearchHit(h); setQ(""); }} className="block w-full px-2.5 py-1.5 text-left hover:bg-accent">
                <div className="text-foreground">{h.name} <span className="text-[10px] text-muted-foreground">({h.type})</span></div>
                <div className="truncate text-[10px] text-muted-foreground">{h.display}</div>
              </button>
            ))}
            {searching && <div className="px-2.5 py-1.5 text-muted-foreground">Searching worldwide…</div>}
          </div>
        )}
      </div>

      <div>
        <SectionTitle>Region</SectionTitle>
        <div className="flex gap-1">
          {(["ALL", "AMER", "EMEA", "APAC"] as const).map((r) => (
            <button key={r} onClick={() => p.setRegion(r)} className={`flex-1 rounded border px-1 py-1 font-mono text-[10px] ${p.region === r ? "border-primary bg-primary/20 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Geography · {countries.length} countries</SectionTitle>
        <div className="max-h-[38vh] overflow-y-auto">{countries.map((c) => renderNode(c, 0))}</div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <SectionTitle>Categories</SectionTitle>
          <button className="mb-2 text-[10px] text-info" onClick={() => p.setCats(p.cats.size === CATEGORIES.length ? new Set() : new Set(CATEGORIES))}>{p.cats.size === CATEGORIES.length ? "none" : "all"}</button>
        </div>
        {CATEGORIES.map((c) => (
          <label key={c} className="flex items-center gap-2 py-0.5 text-xs">
            <input type="checkbox" checked={p.cats.has(c)} onChange={() => { const n = new Set(p.cats); n.has(c) ? n.delete(c) : n.add(c); p.setCats(n); }} />
            {c}
          </label>
        ))}
      </div>
    </div>
  );
}

function IntelPanel({ loc, chain, country, resources, nearby, onSelect }: {
  loc: GeoLoc | null; chain: GeoLoc[]; country?: (typeof COUNTRIES)[number]; resources: Resource[]; nearby: Incident[]; onSelect: (id: string) => void;
}) {
  if (!loc)
    return (
      <div className="p-4 text-xs">
        <SectionTitle>Global Overview</SectionTitle>
        <p className="text-muted-foreground">Select a location on the map or in the geography tree to load emergency numbers, official sources and nearby incidents for that place and every level above it.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {(["critical", "caution", "normal"] as const).map((s) => (
            <div key={s} className="rounded border border-border p-2">
              <div className={`font-mono text-lg ${s === "critical" ? "text-critical" : s === "caution" ? "text-caution" : "text-info"}`}>{nearby.filter((i) => i.severity === s).length}</div>
              <div className="text-[10px] uppercase text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
        <div className="mt-4"><SectionTitle>Priority cities</SectionTitle>
          {BASE_LOCATIONS.filter((l) => l.priority).map((l) => <button key={l.id} onClick={() => onSelect(l.id)} className="block py-0.5 text-info hover:underline">{l.name}</button>)}
        </div>
      </div>
    );
  const byLevel = chain.map((l) => ({ l, items: resources.filter((r) => r.scope === l.id) }));
  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      <div>
        <div className="mb-1 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
          {[...chain].reverse().map((c, i) => (
            <span key={c.id}>{i > 0 && "› "}<button onClick={() => onSelect(c.id)} className="hover:text-foreground">{c.name}</button></span>
          ))}
        </div>
        <h2 className="text-lg font-semibold">{loc.name}</h2>
        <p className="text-muted-foreground">{loc.label ?? loc.type} · {loc.region}{loc.watch ? " · Regional Watch" : ""}</p>
      </div>
      {country && (
        <div className="rounded border border-critical/40 bg-critical/10 p-3">
          <SectionTitle>Emergency numbers · {country.name}</SectionTitle>
          <div className="font-mono text-2xl text-foreground">{country.emergency}</div>
          <div className="mt-1 flex gap-3 font-mono text-[11px] text-muted-foreground">
            {country.police && <span>Police {country.police}</span>}
            {country.fire && <span>Fire {country.fire}</span>}
            {country.ambulance && <span>EMS {country.ambulance}</span>}
          </div>
        </div>
      )}
      <div>
        <SectionTitle>Incidents nearby · {nearby.length}</SectionTitle>
        {nearby.slice(0, 5).map((i) => <IncidentRow key={i.id} i={i} loc={loc} />)}
        {nearby.length === 0 && <p className="text-muted-foreground">No live feed incidents within range.</p>}
      </div>
      {byLevel.map(({ l, items }) => items.length > 0 && (
        <div key={l.id}>
          <SectionTitle>{l.name} · {l.label ?? l.type}</SectionTitle>
          {items.map((r) => <ResourceLink key={r.id} r={r} />)}
        </div>
      ))}
    </div>
  );
}

function ResourceLink({ r }: { r: Resource }) {
  return (
    <a href={r.url} target="_blank" rel="noreferrer" className="mb-1 flex items-start justify-between gap-2 rounded px-1.5 py-1 hover:bg-accent">
      <span className="text-foreground">{r.name}{r.note && <span className="block text-[10px] text-muted-foreground">{r.note}</span>}</span>
      <RelBadge r={r.reliability} />
    </a>
  );
}

function IncidentRow({ i, loc }: { i: Incident; loc?: GeoLoc | null }) {
  const c = i.severity === "critical" ? "bg-critical" : i.severity === "caution" ? "bg-caution" : "bg-info";
  return (
    <a href={i.sourceUrl} target="_blank" rel="noreferrer" className="mb-1 flex gap-2 rounded px-1.5 py-1 hover:bg-accent">
      <i className={`mt-1 h-2 w-2 shrink-0 rounded-full ${c}`} />
      <span className="flex-1">
        <span className="text-foreground">{i.title}</span>
        <span className="block text-[10px] text-muted-foreground">{i.source} · {ago(i.time)}{loc ? ` · ${Math.round(haversineKm(loc, i))} km` : ""}</span>
      </span>
    </a>
  );
}

function ago(t: number) {
  const m = Math.round((Date.now() - t) / 60000);
  return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
}

const th = "sticky top-0 bg-panel px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground";
const td = "px-3 py-1.5 align-top";

function DirectoryTable({ resources, allLocs }: { resources: Resource[]; allLocs: GeoLoc[] }) {
  const [f, setF] = useState("");
  const list = resources.filter((r) => (r.name + r.categories.join(" ")).toLowerCase().includes(f.toLowerCase()));
  return (
    <div>
      <div className="p-2"><input value={f} onChange={(e) => setF(e.target.value)} placeholder="Filter resources…" className="w-72 rounded border border-input bg-background px-2 py-1 text-xs outline-none" /></div>
      <table className="w-full text-xs">
        <thead><tr><th className={th}>Resource</th><th className={th}>Scope</th><th className={th}>Categories</th><th className={th}>Reliability</th></tr></thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-accent/50">
              <td className={td}><a href={r.url} target="_blank" rel="noreferrer" className="text-info hover:underline">{r.name}</a>{r.lang && <span className="ml-1 font-mono text-[10px] text-muted-foreground">[{r.lang}]</span>}</td>
              <td className={td}>{r.scope === "GLOBAL" ? "Global" : allLocs.find((l) => l.id === r.scope)?.name ?? r.scope}</td>
              <td className={`${td} text-muted-foreground`}>{r.categories.join(", ")}</td>
              <td className={td}><RelBadge r={r.reliability} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IncidentTable({ list, loading, errored, onGo, selLoc }: { list: Incident[]; loading: boolean; errored: boolean; onGo: (i: Incident) => void; selLoc: GeoLoc | null }) {
  if (loading) return <p className="p-3 text-xs text-muted-foreground">Loading live feeds (USGS, NASA EONET)…</p>;
  return (
    <table className="w-full text-xs">
      <thead><tr><th className={th}>Severity</th><th className={th}>Event</th><th className={th}>Type</th><th className={th}>Source</th><th className={th}>Status</th><th className={th}>Time</th>{selLoc && <th className={th}>Distance</th>}<th className={th} /></tr></thead>
      <tbody>
        {errored && <tr><td colSpan={8} className="p-3 text-caution">One or more feeds failed to load — results may be incomplete.</td></tr>}
        {list.map((i) => (
          <tr key={i.id} className="border-t border-border hover:bg-accent/50">
            <td className={td}><span className={`font-mono text-[10px] uppercase ${i.severity === "critical" ? "text-critical" : i.severity === "caution" ? "text-caution" : "text-info"}`}>{i.severity}</span></td>
            <td className={td}><a href={i.sourceUrl} target="_blank" rel="noreferrer" className="hover:underline">{i.title}</a></td>
            <td className={`${td} text-muted-foreground`}>{i.type}</td>
            <td className={td}>{i.source}</td>
            <td className={td}>{i.verified ? <span className="text-ok">Verified</span> : <span className="text-caution">Unverified</span>}</td>
            <td className={`${td} font-mono text-muted-foreground`}>{new Date(i.time).toISOString().slice(0, 16).replace("T", " ")}Z</td>
            {selLoc && <td className={`${td} font-mono`}>{Math.round(haversineKm(selLoc, i))} km</td>}
            <td className={td}><button onClick={() => onGo(i)} className="text-info hover:underline">Map</button></td>
          </tr>
        ))}
        {list.length === 0 && <tr><td colSpan={8} className="p-3 text-muted-foreground">No incidents in scope.</td></tr>}
      </tbody>
    </table>
  );
}

function NewsSocial({ loc, chain, country, resources }: { loc: GeoLoc | null; chain: GeoLoc[]; country?: (typeof COUNTRIES)[number]; resources: Resource[] }) {
  const [kw, setKw] = useState("shooting OR explosion OR protest OR fire OR flood OR strike");
  const place = loc ? chain.slice(0, 2).map((c) => c.name).join(" ") : "";
  const q = encodeURIComponent(`${place} ${kw}`.trim());
  const lang = country?.lang ?? "en";
  const searches = [
    { name: "Google News (local language)", url: `https://news.google.com/search?q=${q}&hl=${lang}&gl=${country?.gl ?? "US"}` },
    { name: "Google News (English)", url: `https://news.google.com/search?q=${q}&hl=en` },
    { name: "X – Latest posts", url: `https://x.com/search?q=${q}&f=live` },
    { name: "Reddit – New", url: `https://www.reddit.com/search/?q=${q}&sort=new` },
    { name: "YouTube – Uploaded today", url: `https://www.youtube.com/results?search_query=${q}&sp=EgIIAg%3D%3D` },
    { name: "Telegram public search (tgstat)", url: `https://tgstat.com/search?q=${q}` },
    { name: "GDELT – Global news events", url: `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=artlist&format=html&timespan=24h` },
  ];
  const kwLocal = encodeURIComponent(kw);
  return (
    <div className="grid grid-cols-2 gap-4 p-3 text-xs">
      <div>
        <SectionTitle>Query builder · {loc ? chain.map((c) => c.name).join(" › ") : "Global"}</SectionTitle>
        <input value={kw} onChange={(e) => setKw(e.target.value)} className="mb-2 w-full rounded border border-input bg-background px-2 py-1 font-mono text-[11px] outline-none" />
        {searches.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded px-1.5 py-1 hover:bg-accent"><span className="text-info">{s.name}</span><RelBadge r="unverified" /></a>)}
        {lang !== "en" && (
          <a href={`https://translate.google.com/?sl=en&tl=${lang}&text=${kwLocal}&op=translate`} target="_blank" rel="noreferrer" className="mt-2 block text-info hover:underline">Translate keywords EN → {lang.toUpperCase()} for local-language searching</a>
        )}
        <p className="mt-2 text-[10px] text-caution">Social and aggregated results are unverified until corroborated by an official or verified source.</p>
      </div>
      <div>
        <SectionTitle>Curated news & social sources in scope</SectionTitle>
        {resources.filter((r) => r.categories.some((c) => c.startsWith("News") || c === "Social Media")).map((r) => <ResourceLink key={r.id} r={r} />)}
      </div>
    </div>
  );
}

function WatchList({ watch, onRemove, onSelect }: { watch: GeoLoc[]; onRemove: (id: string) => void; onSelect: (id: string) => void }) {
  return (
    <div className="p-3 text-xs">
      <p className="mb-2 text-muted-foreground">Search any place worldwide in the left panel to add it as a Regional Watch location. Saved in this browser.</p>
      {watch.length === 0 && <p className="text-muted-foreground">No watch locations yet.</p>}
      {watch.map((w) => (
        <div key={w.id} className="flex items-center gap-3 border-t border-border py-1.5">
          <button onClick={() => onSelect(w.id)} className="text-info hover:underline">{w.name}</button>
          <span className="text-muted-foreground">{w.label} · {w.region} · {w.lat.toFixed(2)}, {w.lng.toFixed(2)}</span>
          <button onClick={() => onRemove(w.id)} className="ml-auto text-critical hover:underline">Remove</button>
        </div>
      ))}
    </div>
  );
}

function Admin({ custom, setCustom, allLocs }: { custom: Resource[]; setCustom: (r: Resource[]) => void; allLocs: GeoLoc[] }) {
  const [name, setName] = useState(""); const [url, setUrl] = useState(""); const [scope, setScope] = useState("GLOBAL");
  const [cat, setCat] = useState<Category>(CATEGORIES[0]); const [rel, setRel] = useState<Resource["reliability"]>("verified");
  const valid = name.trim() && /^https?:\/\//.test(url);
  const field = "rounded border border-input bg-background px-2 py-1 text-xs outline-none";
  return (
    <div className="p-3 text-xs">
      <SectionTitle>Add a resource to the directory</SectionTitle>
      <div className="flex flex-wrap gap-2">
        <input className={`${field} w-56`} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={`${field} w-64`} placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
        <select className={field} value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="GLOBAL">Global</option>
          {allLocs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select className={field} value={cat} onChange={(e) => setCat(e.target.value as Category)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select className={field} value={rel} onChange={(e) => setRel(e.target.value as Resource["reliability"])}><option>official</option><option>verified</option><option>unverified</option></select>
        <button disabled={!valid} onClick={() => { setCustom([...custom, { id: `c-${Date.now()}`, name, url, scope, categories: [cat], reliability: rel }]); setName(""); setUrl(""); }}
          className="rounded bg-primary px-3 py-1 text-primary-foreground disabled:opacity-40">Add</button>
      </div>
      <div className="mt-3">
        {custom.map((r) => (
          <div key={r.id} className="flex items-center gap-3 border-t border-border py-1.5">
            <a href={r.url} target="_blank" rel="noreferrer" className="text-info">{r.name}</a>
            <span className="text-muted-foreground">{r.scope} · {r.categories.join(", ")}</span><RelBadge r={r.reliability} />
            <button onClick={() => setCustom(custom.filter((x) => x.id !== r.id))} className="ml-auto text-critical hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
