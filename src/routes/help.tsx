import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "المساعدة — ATLAS AI" },
      { name: "description", content: "دليل استخدام ATLAS AI والأسئلة الشائعة." },
      { property: "og:title", content: "المساعدة — ATLAS AI" },
      { property: "og:description", content: "دليل استخدام ATLAS AI والأسئلة الشائعة." },
    ],
  }),
  component: HelpPage,
});

const FAQ = {
  ar: [
    ["كيف أنشئ مشروعاً؟", "اكتب فكرتك في مربع المحادثة بالرئيسية واضغط «إنشاء مشروع»، أو اختر قالباً جاهزاً."],
    ["أين تُحفظ مشاريعي؟", "تُحفظ تلقائياً في متصفحك على هذا الجهاز. يمكنك تصديرها من الإعدادات."],
    ["هل يولّد ATLAS AI الكود فعلياً الآن؟", "ليس بعد. توليد الكود بالذكاء الاصطناعي يحتاج ربط مزود AI عبر خادم آمن، وسيظهر بوضوح عند تفعيله."],
    ["هل يمكنني نشر مشروعي؟", "النشر الفعلي يحتاج ربط خدمة نشر لاحقاً. حالياً يمكنك التخطيط وتنظيم المكونات ومعاينة الهيكل."],
    ["ما هي المعاينة التفاعلية؟", "مخطط بصري يُبنى من قائمة الملفات والمكونات؛ مرّر فوق أي مكون لتمييزه."],
  ],
  en: [
    ["How do I create a project?", "Write your idea in the dashboard box and press “Create project”, or pick a template."],
    ["Where are my projects saved?", "Automatically in your browser on this device. You can export them from Settings."],
    ["Does ATLAS AI generate code now?", "Not yet. AI code generation requires connecting an AI provider through a secure server; it will be clearly shown once enabled."],
    ["Can I deploy my project?", "Real deployment requires connecting a hosting service later. For now you can plan, organize components and preview the structure."],
    ["What is the interactive preview?", "A visual wireframe built from your files list; hover a component to highlight it."],
  ],
};

function HelpPage() {
  const { t, lang } = useI18n();
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <h1 className="mb-2 text-3xl font-bold">{t("help")}</h1>
      {FAQ[lang].map(([q, a]) => (
        <details key={q} className="glass group rounded-2xl p-5">
          <summary className="cursor-pointer list-none font-bold text-primary">{q}</summary>
          <p className="mt-3 text-muted-foreground">{a}</p>
        </details>
      ))}
    </div>
  );
}