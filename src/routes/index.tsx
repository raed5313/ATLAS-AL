import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { projectStore, useProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { TemplateGrid } from "@/components/TemplateGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATLAS AI — لوحة التحكم" },
      { name: "description", content: "اكتب فكرة برنامجك وأنشئ مساحة عمل منظمة لبنائه مع ATLAS AI." },
      { property: "og:title", content: "ATLAS AI — لوحة التحكم" },
      { property: "og:description", content: "اكتب فكرة برنامجك وأنشئ مساحة عمل منظمة لبنائه." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useI18n();
  const projects = useProjects();
  const nav = useNavigate();
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const create = () => {
    if (!idea.trim()) return;
    const p = projectStore.create({ name, description: idea, template: "blank", lang });
    nav({ to: "/projects/$id", params: { id: p.id } });
  };

  return (
    <div className="flex flex-col gap-12">
      <section className="relative fade-up">
        <div className="float-slow pointer-events-none absolute -top-6 end-4 hidden h-28 w-28 rounded-3xl bg-gold opacity-80 md:block" style={{ transform: "rotate(12deg)" }} />
        <div className="float-slow pointer-events-none absolute top-24 end-36 hidden h-12 w-12 rounded-2xl border border-primary/50 md:block" style={{ animationDelay: "1.5s" }} />
        <p className="text-sm font-semibold text-muted-foreground">{t("welcome")}</p>
        <h1 className="text-gold mt-1 text-5xl font-bold md:text-6xl">ATLAS AI</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("welcome_sub")}</p>
      </section>

      <section className="glass fade-up rounded-3xl p-4 md:p-6" style={{ animationDelay: ".1s" }}>
        <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={5} placeholder={t("idea_ph")}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) create(); }}
          className="w-full resize-none rounded-2xl border border-input bg-background/40 p-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name_ph")}
            className="flex-1 rounded-xl border border-input bg-background/40 px-4 py-3 outline-none focus:border-primary" />
          <button onClick={create} disabled={!idea.trim()}
            className="bg-gold inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold transition hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100">
            <Sparkles className="h-5 w-5" />{t("create")}</button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("recent")}</h2>
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">{t("view_all")}<Arrow className="h-4 w-4" /></Link>
        </div>
        {projects.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">{t("no_projects")}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{projects.slice(0, 6).map((p) => <ProjectCard key={p.id} p={p} />)}</div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">{t("templates")}</h2>
        <TemplateGrid />
      </section>
    </div>
  );
}