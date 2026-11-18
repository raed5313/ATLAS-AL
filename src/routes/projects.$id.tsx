import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Cloud, Cpu, Plus, Rocket, Trash2, X, ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useI18n, type Key } from "@/lib/i18n";
import { projectStore, STAGES, useProjects, type Project, type Stage } from "@/lib/projects";
import { integrations } from "@/lib/integrations";
import { SetupBadge } from "@/components/AppShell";

export const Route = createFileRoute("/projects/$id")({
  head: () => ({
    meta: [
      { title: "مساحة العمل — ATLAS AI" },
      { name: "description", content: "مساحة عمل المشروع: الوصف، التعليمات، المكونات، المعاينة ومراحل البناء." },
      { property: "og:title", content: "مساحة العمل — ATLAS AI" },
      { property: "og:description", content: "خطط لمشروعك وابنِه خطوة بخطوة." },
    ],
  }),
  component: Workspace,
});

const stageKey: Record<Stage, Key> = { idea: "st_idea", plan: "st_plan", design: "st_design", build: "st_build", deploy: "st_deploy" };

function Workspace() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const projects = useProjects();
  const p = projects.find((x) => x.id === id);
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;
  if (!p) return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-muted-foreground">{t("not_found")}</p>
      <Link to="/projects" className="bg-gold mt-4 inline-block rounded-lg px-4 py-2 font-bold">{t("back")}</Link>
    </div>
  );
  return <WorkspaceInner p={p} Back={Back} />;
}

function WorkspaceInner({ p, Back }: { p: Project; Back: typeof ArrowLeft }) {
  const { t } = useI18n();
  const nav = useNavigate();
  const [file, setFile] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const up = (patch: Partial<Project>) => projectStore.update(p.id, patch);
  const stageIdx = STAGES.indexOf(p.stage);
  const field = "w-full rounded-xl border border-input bg-background/40 p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link to="/projects" className="glass grid h-10 w-10 shrink-0 place-items-center rounded-xl" aria-label={t("back")}><Back className="h-5 w-5" /></Link>
          <input value={p.name} onChange={(e) => up({ name: e.target.value })} aria-label={t("rename")}
            className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 font-display text-2xl font-bold outline-none hover:border-border focus:border-primary md:text-3xl" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-success"><Check className="h-4 w-4" />{t("saved")}</span>
          <button onClick={() => setNotice(t("ai_off"))} className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
            <Cpu className="h-4 w-4 text-primary" />{t("generate")}{!integrations.ai.configured && <SetupBadge>{t("needs_setup")}</SetupBadge>}</button>
          <button onClick={() => setNotice(t("deploy_off"))} className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
            <Rocket className="h-4 w-4 text-primary" />{t("deploy")}{!integrations.deploy.configured && <SetupBadge>{t("needs_setup")}</SetupBadge>}</button>
          <button onClick={() => { if (confirm(t("confirm_delete"))) { projectStore.remove(p.id); nav({ to: "/projects" }); } }}
            className="rounded-xl border border-destructive/40 p-2.5 text-destructive hover:bg-destructive/15" aria-label={t("delete")}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      {notice && (
        <div className="fade-up flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" /><p className="flex-1">{notice}</p>
          <button onClick={() => setNotice(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <section className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-lg font-bold">{t("stages")}</h2>
        <div className="grid grid-cols-5 gap-2">
          {STAGES.map((s, i) => (
            <button key={s} onClick={() => up({ stage: s })} className="group flex flex-col items-center gap-2">
              <div className={`h-2 w-full rounded-full transition ${i <= stageIdx ? "bg-gold" : "bg-muted"}`} />
              <span className={`text-xs font-semibold md:text-sm ${i <= stageIdx ? "text-primary" : "text-muted-foreground"}`}>{t(stageKey[s])}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <section className="glass rounded-2xl p-5">
            <h2 className="mb-3 text-lg font-bold">{t("description")}</h2>
            <textarea rows={4} value={p.description} onChange={(e) => up({ description: e.target.value })} className={field} />
          </section>
          <section className="glass rounded-2xl p-5">
            <h2 className="mb-3 text-lg font-bold">{t("instructions")}</h2>
            <textarea rows={8} value={p.instructions} placeholder={t("instructions_ph")} onChange={(e) => up({ instructions: e.target.value })} className={`${field} font-mono text-sm`} />
          </section>
          <section className="glass rounded-2xl p-5">
            <h2 className="mb-3 text-lg font-bold">{t("files")}</h2>
            <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = file.trim(); if (v && !p.files.includes(v)) up({ files: [...p.files, v] }); setFile(""); }}>
              <input value={file} onChange={(e) => setFile(e.target.value)} placeholder={t("file_ph")} className={field} dir="ltr" />
              <button className="bg-gold inline-flex items-center gap-1 rounded-xl px-4 font-bold"><Plus className="h-4 w-4" />{t("add_file")}</button>
            </form>
            <ul className="flex flex-col gap-1.5">
              {p.files.map((f, i) => (
                <li key={f} onMouseEnter={() => setSelected(f)} onMouseLeave={() => setSelected(null)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-sm transition ${selected === f ? "border-primary bg-primary/10" : "border-border bg-background/30"}`} dir="ltr">
                  <span><span className="text-muted-foreground">{String(i + 1).padStart(2, "0")} </span>{f}.tsx</span>
                  <button onClick={() => up({ files: p.files.filter((x) => x !== f) })} className="text-muted-foreground hover:text-destructive" aria-label={t("delete")}><X className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="glass flex flex-col rounded-2xl p-5 xl:col-span-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">{t("preview")}</h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Cloud className="h-4 w-4" />{t("preview_note")}</span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background/50" style={{ minHeight: 480 }}>
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2" dir="ltr">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" /><span className="h-2.5 w-2.5 rounded-full bg-warning/70" /><span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ms-3 truncate text-xs text-muted-foreground">{p.name}</span>
            </div>
            <Wireframe files={p.files} selected={selected} onSelect={setSelected} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Wireframe({ files, selected, onSelect }: { files: string[]; selected: string | null; onSelect: (f: string | null) => void }) {
  const hasSide = files.some((f) => /side/i.test(f));
  const tops = files.filter((f) => /header|nav/i.test(f));
  const bottoms = files.filter((f) => /footer/i.test(f));
  const sides = files.filter((f) => /side/i.test(f));
  const mains = files.filter((f) => !tops.includes(f) && !bottoms.includes(f) && !sides.includes(f));
  const Block = ({ f, className = "" }: { f: string; className?: string }) => (
    <button onMouseEnter={() => onSelect(f)} onMouseLeave={() => onSelect(null)} onClick={() => onSelect(f)}
      className={`rounded-lg border border-dashed p-3 text-start font-mono text-xs transition ${selected === f ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground"} ${className}`} dir="ltr">{f}</button>
  );
  return (
    <div className="flex flex-1 flex-col gap-2 p-3">
      {tops.map((f) => <Block key={f} f={f} className="h-12" />)}
      <div className="flex flex-1 gap-2">
        {hasSide && <div className="flex w-1/4 flex-col gap-2">{sides.map((f) => <Block key={f} f={f} className="flex-1" />)}</div>}
        <div className="grid flex-1 auto-rows-fr gap-2 sm:grid-cols-2">{mains.map((f) => <Block key={f} f={f} className="min-h-20" />)}</div>
      </div>
      {bottoms.map((f) => <Block key={f} f={f} className="h-10" />)}
    </div>
  );
}