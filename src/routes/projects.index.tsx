import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { TEMPLATES, useProjects, type TemplateId } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "المشاريع — ATLAS AI" },
      { name: "description", content: "ابحث في مشاريعك وصفّها حسب القالب." },
      { property: "og:title", content: "المشاريع — ATLAS AI" },
      { property: "og:description", content: "ابحث في مشاريعك وصفّها حسب القالب." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { t, lang } = useI18n();
  const projects = useProjects();
  const [q, setQ] = useState("");
  const [f, setF] = useState<TemplateId | "all">("all");
  const list = useMemo(() => projects.filter((p) =>
    (f === "all" || p.template === f) &&
    (p.name + " " + p.description).toLowerCase().includes(q.toLowerCase())), [projects, q, f]);
  const filters: (TemplateId | "all")[] = ["all", "admin", "store", "company", "dashboard", "blank"];
  const label = (x: TemplateId | "all") => x === "all" ? t("all") : x === "blank" ? t("blank") : TEMPLATES[x][lang];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t("nav_projects")} <span className="text-base text-muted-foreground">({projects.length})</span></h1>
      <div className="relative">
        <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")}
          className="glass w-full rounded-xl py-3 ps-12 pe-4 outline-none focus:border-primary" />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((x) => (
          <button key={x} onClick={() => setF(x)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${f === x ? "bg-gold" : "glass text-muted-foreground hover:text-foreground"}`}>{label(x)}</button>
        ))}
      </div>
      {list.length === 0 ? <div className="glass rounded-2xl p-8 text-center text-muted-foreground">{t("no_projects")}</div> :
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div>}
    </div>
  );
}