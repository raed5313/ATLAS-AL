import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Rocket, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { projectStore, useProjects } from "@/lib/projects";
import { integrations } from "@/lib/integrations";
import { SetupBadge } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — ATLAS AI" },
      { name: "description", content: "إعدادات اللغة والتكاملات والبيانات في ATLAS AI." },
      { property: "og:title", content: "الإعدادات — ATLAS AI" },
      { property: "og:description", content: "إعدادات اللغة والتكاملات والبيانات." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const projects = useProjects();
  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "atlas-projects.json"; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="text-3xl font-bold">{t("settings")}</h1>
      <section className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-lg font-bold">{t("language")}</h2>
        <div className="flex gap-2">
          {(["ar", "en"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`rounded-xl px-5 py-2 font-semibold ${lang === l ? "bg-gold" : "glass"}`}>{l === "ar" ? "العربية" : "English"}</button>
          ))}
        </div>
      </section>
      <section className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-lg font-bold">{t("integrations")}</h2>
        {[{ icon: Cpu, k: "ai_provider" as const, ok: integrations.ai.configured }, { icon: Rocket, k: "deploy_service" as const, ok: integrations.deploy.configured }].map(({ icon: I, k, ok }) => (
          <div key={k} className="mb-2 flex items-center justify-between rounded-xl border border-border bg-background/30 p-4">
            <span className="flex items-center gap-3 font-semibold"><I className="h-5 w-5 text-primary" />{t(k)}</span>
            {ok ? null : <SetupBadge>{t("not_connected")}</SetupBadge>}
          </div>
        ))}
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />{t("integ_note")}</p>
      </section>
      <section className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-lg font-bold">{t("data")}</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportJson} className="rounded-xl border border-primary/50 px-4 py-2 font-semibold text-primary hover:bg-primary/10">{t("export")}</button>
          <button onClick={() => confirm(t("confirm_clear")) && projectStore.clear()} className="rounded-xl border border-destructive/50 px-4 py-2 font-semibold text-destructive hover:bg-destructive/10">{t("clear")}</button>
        </div>
      </section>
    </div>
  );
}