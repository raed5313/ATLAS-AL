import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
const dict = {
  ar: {
    brand: "ATLAS AI", tagline: "منصة بناء البرامج والتطبيقات",
    nav_dashboard: "الرئيسية", nav_projects: "المشاريع", nav_templates: "القوالب", nav_settings: "الإعدادات", nav_help: "المساعدة",
    welcome: "مرحباً بك في", welcome_sub: "صف فكرة برنامجك، وسننشئ لك مساحة عمل منظمة لتخطيطه وبنائه خطوة بخطوة.",
    idea_ph: "مثال: نظام لإدارة عيادة يتضمن مواعيد المرضى والفواتير وتقارير شهرية…",
    name_ph: "اسم المشروع (اختياري)", create: "إنشاء مشروع", recent: "المشاريع الحديثة", view_all: "عرض الكل",
    templates: "القوالب", use_template: "استخدام القالب", no_projects: "لا توجد مشاريع بعد. ابدأ بكتابة فكرتك أعلاه.",
    search: "ابحث في المشاريع…", all: "الكل", open: "فتح", delete: "حذف", confirm_delete: "هل تريد حذف هذا المشروع نهائياً؟",
    updated: "آخر تحديث", saved: "محفوظ محلياً", not_found: "المشروع غير موجود",
    description: "وصف المشروع", instructions: "محرر التعليمات", instructions_ph: "اكتب تعليمات تفصيلية: الصفحات، الأدوار، البيانات، الألوان…",
    files: "الملفات والمكونات", add_file: "إضافة", file_ph: "اسم ملف أو مكون", preview: "المعاينة التفاعلية", stages: "مراحل البناء",
    generate: "توليد الكود بالذكاء الاصطناعي", deploy: "نشر المشروع", needs_setup: "يحتاج إعداداً",
    ai_off: "توليد الكود بالذكاء الاصطناعي غير مفعّل بعد. يلزم ربط مزود AI عبر خادم آمن لاحقاً.",
    deploy_off: "النشر الفعلي غير مفعّل بعد. يلزم ربط خدمة نشر لاحقاً.",
    preview_note: "معاينة تخطيطية مبنية من قائمة المكونات — ليست كوداً مولّداً.",
    st_idea: "الفكرة", st_plan: "التخطيط", st_design: "التصميم", st_build: "البناء", st_deploy: "النشر",
    status_draft: "مسودة", status_planning: "تخطيط", status_building: "قيد البناء",
    settings: "الإعدادات", language: "اللغة", integrations: "التكاملات", ai_provider: "مزود الذكاء الاصطناعي", deploy_service: "خدمة النشر",
    not_connected: "غير مربوط", integ_note: "لأمانك، لا تُحفظ مفاتيح API في المتصفح. سيتم الربط عبر خادم آمن عند إضافته.",
    data: "البيانات", export: "تصدير المشاريع (JSON)", clear: "حذف كل المشاريع", confirm_clear: "سيتم حذف جميع المشاريع. متابعة؟",
    help: "المساعدة", rename: "إعادة تسمية", back: "رجوع", blank: "مشروع فارغ", project_count: "مشروع",
  },
  en: {
    brand: "ATLAS AI", tagline: "Software & app building platform",
    nav_dashboard: "Dashboard", nav_projects: "Projects", nav_templates: "Templates", nav_settings: "Settings", nav_help: "Help",
    welcome: "Welcome to", welcome_sub: "Describe your app idea and get an organized workspace to plan and build it step by step.",
    idea_ph: "e.g. A clinic management system with patient appointments, invoices and monthly reports…",
    name_ph: "Project name (optional)", create: "Create project", recent: "Recent projects", view_all: "View all",
    templates: "Templates", use_template: "Use template", no_projects: "No projects yet. Start by writing your idea above.",
    search: "Search projects…", all: "All", open: "Open", delete: "Delete", confirm_delete: "Delete this project permanently?",
    updated: "Updated", saved: "Saved locally", not_found: "Project not found",
    description: "Project description", instructions: "Instructions editor", instructions_ph: "Write detailed instructions: pages, roles, data, colors…",
    files: "Files & components", add_file: "Add", file_ph: "File or component name", preview: "Interactive preview", stages: "Build stages",
    generate: "Generate code with AI", deploy: "Deploy project", needs_setup: "Needs setup",
    ai_off: "AI code generation is not enabled yet. An AI provider must be connected through a secure server later.",
    deploy_off: "Real deployment is not enabled yet. A hosting service must be connected later.",
    preview_note: "Wireframe preview built from your component list — not generated code.",
    st_idea: "Idea", st_plan: "Planning", st_design: "Design", st_build: "Build", st_deploy: "Deploy",
    status_draft: "Draft", status_planning: "Planning", status_building: "Building",
    settings: "Settings", language: "Language", integrations: "Integrations", ai_provider: "AI provider", deploy_service: "Deployment service",
    not_connected: "Not connected", integ_note: "For your security, API keys are never stored in the browser. Connection will happen via a secure server once added.",
    data: "Data", export: "Export projects (JSON)", clear: "Delete all projects", confirm_clear: "All projects will be deleted. Continue?",
    help: "Help", rename: "Rename", back: "Back", blank: "Blank project", project_count: "projects",
  },
} as const;
export type Key = keyof typeof dict.ar;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "ar", setLang: () => {}, t: (k) => dict.ar[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  useEffect(() => {
    const s = localStorage.getItem("atlas.lang");
    if (s === "en" || s === "ar") setLangState(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => { localStorage.setItem("atlas.lang", l); setLangState(l); };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);