import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Incident } from "@/lib/feeds";
import type { GeoLoc } from "@/lib/geo-data";

maplibregl.setWorkerUrl(workerUrl);

export type MapStyle = "dark" | "positron" | "liberty";
export interface MapHandle {
  flyTo: (lat: number, lng: number, zoom: number) => void;
  fitBounds: (b: [number, number, number, number]) => void;
  reset: () => void;
}
interface Props {
  styleName: MapStyle;
  incidents: Incident[];
  locations: GeoLoc[];
  selectedId: string | null;
  showIncidents: boolean;
  showLocations: boolean;
  onSelectLocation: (id: string) => void;
  onSelectIncident: (id: string) => void;
}

const SEV_COLOR = { critical: "#ef4444", caution: "#f59e0b", normal: "#2dd4bf" };

const SentinelMap = forwardRef<MapHandle, Props>(function SentinelMap(p, ref) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const props = useRef(p);
  props.current = p;

  useImperativeHandle(ref, () => ({
    flyTo: (lat, lng, zoom) => map.current?.flyTo({ center: [lng, lat], zoom, speed: 1.4 }),
    fitBounds: (b) => map.current?.fitBounds([[b[0], b[1]], [b[2], b[3]]], { padding: 60, maxZoom: 12 }),
    reset: () => map.current?.flyTo({ center: [10, 25], zoom: 1.6 }),
  }));

  const addLayers = () => {
    const m = map.current!;
    const cur = props.current;
    m.addSource("incidents", { type: "geojson", data: incGeo(cur.incidents), cluster: true, clusterRadius: 40, clusterMaxZoom: 7 });
    m.addLayer({ id: "inc-cluster", type: "circle", source: "incidents", filter: ["has", "point_count"],
      paint: { "circle-color": "#0e7490", "circle-opacity": 0.85, "circle-stroke-color": "#67e8f9", "circle-stroke-width": 1,
        "circle-radius": ["step", ["get", "point_count"], 12, 10, 16, 50, 22] } });
    m.addLayer({ id: "inc-count", type: "symbol", source: "incidents", filter: ["has", "point_count"],
      layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 11, "text-font": ["Noto Sans Regular"] },
      paint: { "text-color": "#ecfeff" } });
    m.addLayer({ id: "inc-point", type: "circle", source: "incidents", filter: ["!", ["has", "point_count"]],
      paint: { "circle-radius": 5, "circle-color": ["match", ["get", "severity"], "critical", SEV_COLOR.critical, "caution", SEV_COLOR.caution, SEV_COLOR.normal],
        "circle-stroke-color": "#0b1220", "circle-stroke-width": 1.2 } });
    m.addSource("locs", { type: "geojson", data: locGeo(cur.locations, cur.selectedId) });
    m.addLayer({ id: "loc-point", type: "circle", source: "locs",
      paint: { "circle-radius": ["case", ["get", "sel"], 9, ["get", "priority"], 6, 4],
        "circle-color": ["case", ["get", "sel"], "#38bdf8", ["get", "watch"], "#f59e0b", "#22c55e"],
        "circle-opacity": 0.9, "circle-stroke-color": "#e0f2fe", "circle-stroke-width": ["case", ["get", "sel"], 2, 0.6] } });
    m.addLayer({ id: "loc-label", type: "symbol", source: "locs", minzoom: 3,
      layout: { "text-field": ["get", "name"], "text-size": 11, "text-offset": [0, 1.2], "text-font": ["Noto Sans Regular"] },
      paint: { "text-color": "#bae6fd", "text-halo-color": "#0b1220", "text-halo-width": 1.2 } });
    applyVisibility();
  };

  const applyVisibility = () => {
    const m = map.current;
    if (!m?.getLayer("inc-point")) return;
    const v = (b: boolean) => (b ? "visible" : "none");
    for (const id of ["inc-cluster", "inc-count", "inc-point"]) m.setLayoutProperty(id, "visibility", v(props.current.showIncidents));
    for (const id of ["loc-point", "loc-label"]) m.setLayoutProperty(id, "visibility", v(props.current.showLocations));
  };

  useEffect(() => {
    const m = new maplibregl.Map({
      container: el.current!,
      style: `https://tiles.openfreemap.org/styles/${p.styleName}`,
      center: [10, 25],
      zoom: 1.6,
      attributionControl: { compact: true },
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl(), "top-right");
    m.addControl(new maplibregl.FullscreenControl(), "top-right");
    m.addControl(new maplibregl.ScaleControl(), "bottom-left");
    m.on("style.load", addLayers);
    m.on("click", "loc-point", (e) => {
      const id = e.features?.[0]?.properties?.id;
      if (id) props.current.onSelectLocation(id);
    });
    m.on("click", "inc-point", (e) => {
      const f = e.features?.[0];
      if (!f) return;
      props.current.onSelectIncident(f.properties.id);
      new maplibregl.Popup({ closeButton: false })
        .setLngLat((f.geometry as any).coordinates)
        .setHTML(`<strong>${escape(f.properties.title)}</strong><br/><span>${escape(f.properties.source)} · ${f.properties.verified ? "Verified" : "Unverified"}</span>`)
        .addTo(m);
    });
    m.on("click", "inc-cluster", async (e) => {
      const f = e.features![0];
      const src = m.getSource("incidents") as maplibregl.GeoJSONSource;
      const z = await src.getClusterExpansionZoom(f.properties.cluster_id);
      m.easeTo({ center: (f.geometry as any).coordinates, zoom: z });
    });
    for (const l of ["loc-point", "inc-point", "inc-cluster"]) {
      m.on("mouseenter", l, () => (m.getCanvas().style.cursor = "pointer"));
      m.on("mouseleave", l, () => (m.getCanvas().style.cursor = ""));
    }
    return () => m.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    map.current?.setStyle(`https://tiles.openfreemap.org/styles/${p.styleName}`);
  }, [p.styleName]);

  useEffect(() => {
    (map.current?.getSource("incidents") as maplibregl.GeoJSONSource | undefined)?.setData(incGeo(p.incidents));
  }, [p.incidents]);

  useEffect(() => {
    (map.current?.getSource("locs") as maplibregl.GeoJSONSource | undefined)?.setData(locGeo(p.locations, p.selectedId));
  }, [p.locations, p.selectedId]);

  useEffect(applyVisibility, [p.showIncidents, p.showLocations]);

  return <div ref={el} className="h-full w-full" />;
});

function escape(s: string) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}
function incGeo(list: Incident[]): import("geojson").FeatureCollection {
  return { type: "FeatureCollection", features: list.map((i) => ({ type: "Feature", geometry: { type: "Point", coordinates: [i.lng, i.lat] },
    properties: { id: i.id, title: i.title, source: i.source, severity: i.severity, verified: i.verified } })) };
}
function locGeo(list: GeoLoc[], sel: string | null): import("geojson").FeatureCollection {
  return { type: "FeatureCollection", features: list.map((l) => ({ type: "Feature", geometry: { type: "Point", coordinates: [l.lng, l.lat] },
    properties: { id: l.id, name: l.name, sel: l.id === sel, priority: !!l.priority || l.type === "country", watch: !!l.watch } })) };
}

export default SentinelMap;
