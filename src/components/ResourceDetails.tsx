import type { Resource } from "@/lib/geo-data";
import { accessMode, isVerified, operationalPhone, sourceClassification, INTEL_SECTIONS, sectionResources } from "@/lib/resource-verification";

export function SourceBadge({ resource }: { resource: Resource }) {
  const classification = sourceClassification(resource);
  const color = classification === "Official Primary Source" ? "text-ok border-ok/40" : classification === "Independently Rated News Source" ? "text-info border-info/40" : "text-caution border-caution/40";
  return <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] ${color}`}>{classification}</span>;
}

export function ResourceDetails({ resource: r }: { resource: Resource }) {
  const phone = operationalPhone(r);
  return <div className="border-t border-border py-2 text-xs">
    <a href={r.url} target="_blank" rel="noreferrer" className="block break-words text-info hover:underline">{r.name} ↗</a>
    <div className="mt-1"><SourceBadge resource={r} /></div>
    <div className="mt-1 text-[10px] text-muted-foreground">{accessMode(r)} · {r.lang ?? "Language not recorded"}</div>
    <details className="mt-1">
      <summary className="cursor-pointer text-[10px] text-muted-foreground">Source details · {isVerified(r) ? `Verified ${r.lastVerified}` : "Needs Verification"}</summary>
      <dl className="mt-1 space-y-1 text-[11px] text-muted-foreground">
        <div><dt className="inline">Organization: </dt><dd className="inline">{r.organization ?? "Not recorded"}</dd></div>
        <div><dt className="inline">Coverage: </dt><dd className="inline">{r.coverage ?? r.scope}</dd></div>
        <div><dt className="inline">Best used for: </dt><dd className="inline">{r.bestUsedFor ?? r.note ?? "Not recorded"}</dd></div>
        <div><dt className="inline">Category: </dt><dd className="inline">{r.categories.join(", ")}</dd></div>
        <div><dt className="inline">Last verified: </dt><dd className="inline">{r.lastVerified ?? "Not yet verified"}</dd></div>
        {r.evidenceUrl && <a href={r.evidenceUrl} target="_blank" rel="noreferrer" className="block text-info hover:underline">Verification evidence ↗</a>}
        {r.ratingEvidenceUrl && <a href={r.ratingEvidenceUrl} target="_blank" rel="noreferrer" className="block text-info hover:underline">Independent rating evidence ↗</a>}
        {r.note && <p>{r.note}</p>}
      </dl>
    </details>
    {phone && <a className="mt-1 block font-mono text-[11px] text-ok hover:underline" href={`tel:${phone.number.replace(/[^+\d]/g, "")}`}>{phone.number} · {phone.label}</a>}
    {r.socialAccounts?.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="mt-1 block text-[11px] text-info hover:underline">{s.platform} · {s.verified ? "Official account" : "Needs Verification"} · external ↗</a>)}
  </div>;
}

export function WichitaIntelligence({ resources }: { resources: Resource[] }) {
  return <div>{INTEL_SECTIONS.map((section) => {
    const items = sectionResources(section, resources);
    return <details key={section} open={section === "Emergency Contacts" || section === "Police & Public Safety"} className="border-t border-border py-2">
      <summary className="cursor-pointer text-xs font-medium">{section} <span className="text-muted-foreground">({items.length})</span></summary>
      {items.map((r) => <ResourceDetails key={r.id} resource={r} />)}
      {!items.length && <p className="mt-2 text-[11px] text-muted-foreground">No resources in the selected filters.</p>}
    </details>;
  })}</div>;
}