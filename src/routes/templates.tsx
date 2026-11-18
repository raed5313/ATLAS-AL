import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { TemplateGrid } from "@/components/TemplateGrid";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "القوالب — ATLAS AI" },
      { name: "description", content: "ابدأ مشروعك من قالب: نظام إداري، متجر، موقع شركة أو لوحة تحكم." },
      { property: "og:title", content: "القوالب — ATLAS AI" },
      { property: "og:description", content: "ابدأ مشروعك من قالب جاهز." },
    ],
  }),
  component: () => {
    const { t } = useI18n();
    return <div className="flex flex-col gap-6"><h1 className="text-3xl font-bold">{t("templates")}</h1><TemplateGrid /></div>;
  },
});