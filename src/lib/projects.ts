import { useSyncExternalStore } from "react";

export type TemplateId = "admin" | "store" | "company" | "dashboard" | "blank";
export type Stage = "idea" | "plan" | "design" | "build" | "deploy";
export const STAGES: Stage[] = ["idea", "plan", "design", "build", "deploy"];

export interface Project {
  id: string; name: string; description: string; instructions: string;
  template: TemplateId; files: string[]; stage: Stage; createdAt: number; updatedAt: number;
}

export const TEMPLATES: Record<Exclude<TemplateId, "blank">, { ar: string; en: string; descAr: string; descEn: string; files: string[] }> = {
  admin: { ar: "نظام إداري", en: "Admin system", descAr: "مستخدمون، صلاحيات، سجلات وتقارير", descEn: "Users, roles, records and reports",
    files: ["Header", "Sidebar", "UsersTable", "RolesPanel", "ReportsChart", "Footer"] },
  store: { ar: "متجر إلكتروني", en: "Online store", descAr: "منتجات، سلة، دفع وطلبات", descEn: "Products, cart, checkout and orders",
    files: ["Header", "Hero", "ProductGrid", "Cart", "Checkout", "Footer"] },
  company: { ar: "موقع شركة", en: "Company website", descAr: "تعريف، خدمات، فريق وتواصل", descEn: "About, services, team and contact",
    files: ["Header", "Hero", "Services", "Team", "ContactForm", "Footer"] },
  dashboard: { ar: "لوحة تحكم", en: "Dashboard", descAr: "مؤشرات، رسوم بيانية وجداول", descEn: "KPIs, charts and tables",
    files: ["Header", "Sidebar", "KpiCards", "ReportsChart", "DataTable", "Footer"] },
};

const KEY = "atlas.projects.v1";
let cache: Project[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: Project[] = [];

function load(): Project[] {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { cache = []; }
  return cache!;
}
function save(next: Project[]) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export const projectStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  getAll: load,
  create(input: { name?: string; description: string; template: TemplateId; lang: "ar" | "en" }): Project {
    const tpl = input.template !== "blank" ? TEMPLATES[input.template] : null;
    const now = Date.now();
    const fallback = tpl ? tpl[input.lang] : input.description.trim().split(/\s+/).slice(0, 4).join(" ") || (input.lang === "ar" ? "مشروع جديد" : "New project");
    const p: Project = {
      id: crypto.randomUUID(), name: input.name?.trim() || fallback, description: input.description.trim(),
      instructions: "", template: input.template, files: tpl ? [...tpl.files] : ["Header", "Main", "Footer"],
      stage: "idea", createdAt: now, updatedAt: now,
    };
    save([p, ...load()]);
    return p;
  },
  update(id: string, patch: Partial<Omit<Project, "id" | "createdAt">>) {
    save(load().map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)));
  },
  remove(id: string) { save(load().filter((p) => p.id !== id)); },
  clear() { save([]); },
};

export function useProjects(): Project[] {
  return useSyncExternalStore(projectStore.subscribe, load, () => EMPTY);
}