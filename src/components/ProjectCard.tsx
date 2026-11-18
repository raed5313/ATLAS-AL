import { Link } from "@tanstack/react-router";
import { Trash2, FolderOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { projectStore, TEMPLATES, type Project } from "@/lib/projects";

export function ProjectCard({ p }: { p: Project }) {
  const { t, lang } = useI18n();
  const tpl = p.template === "blank" ? t("blank") : TEMPLATES[p.template][lang];
  return (
    <div className="glass lift fade-up flex flex-col gap-3 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 text-lg font-bold">{p.name}</h3>
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs text-primary">{tpl}</span>
      </div>
      <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{p.description || "—"}</p>
      <div className="text-xs text-muted-foreground">{t("updated")}: {new Date(p.updatedAt).toLocaleString(lang === "ar" ? "ar" : "en")}</div>
      <div className="mt-1 flex gap-2">
        <Link to="/projects/$id" params={{ id: p.id }} className="bg-gold inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold">
          <FolderOpen className="h-4 w-4" />{t("open")}</Link>
        <button onClick={() => confirm(t("confirm_delete")) && projectStore.remove(p.id)}
          className="rounded-lg border border-destructive/40 px-3 text-destructive transition hover:bg-destructive/15" aria-label={t("delete")}>
          <Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}