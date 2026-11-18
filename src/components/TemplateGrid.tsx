import { useNavigate } from "@tanstack/react-router";
import { Building2, LayoutDashboard, ShieldCheck, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { projectStore, TEMPLATES } from "@/lib/projects";

const ICONS = { admin: ShieldCheck, store: ShoppingBag, company: Building2, dashboard: LayoutDashboard };

export function TemplateGrid() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {(Object.keys(TEMPLATES) as (keyof typeof TEMPLATES)[]).map((id) => {
        const tp = TEMPLATES[id]; const Icon = ICONS[id];
        return (
          <div key={id} className="glass lift flex flex-col gap-3 rounded-2xl p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold"><Icon className="h-6 w-6" /></div>
            <h3 className="text-lg font-bold">{tp[lang]}</h3>
            <p className="flex-1 text-sm text-muted-foreground">{lang === "ar" ? tp.descAr : tp.descEn}</p>
            <button onClick={() => {
              const p = projectStore.create({ template: id, description: lang === "ar" ? tp.descAr : tp.descEn, lang });
              nav({ to: "/projects/$id", params: { id: p.id } });
            }} className="rounded-lg border border-primary/50 px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/10">{t("use_template")}</button>
          </div>
        );
      })}
    </div>
  );
}