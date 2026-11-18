import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { FolderKanban, HelpCircle, LayoutDashboard, LayoutTemplate, Menu, Settings, X, Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gold font-display text-lg font-bold">A</div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tracking-wider text-gold">ATLAS AI</div>
      </div>
    </div>
  );
}

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary transition hover:scale-105">
      <Languages className="h-4 w-4" />{lang === "ar" ? "English" : "العربية"}
    </button>
  );
}

const NAV = [
  { to: "/", k: "nav_dashboard", icon: LayoutDashboard },
  { to: "/projects", k: "nav_projects", icon: FolderKanban },
  { to: "/templates", k: "nav_templates", icon: LayoutTemplate },
  { to: "/settings", k: "nav_settings", icon: Settings },
  { to: "/help", k: "nav_help", icon: HelpCircle },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, k, icon: Icon }) => (
        <Link key={to} to={to} onClick={() => setOpen(false)}
          className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            active(to) ? "bg-gold" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
          <Icon className="h-5 w-5" />{t(k)}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full">
      <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-y-0 border-s-0 p-5 lg:flex">
        <Logo />
        {nav}
        <div className="mt-auto rounded-xl border border-border p-3 text-xs text-muted-foreground">{t("tagline")}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="glass fade-up absolute inset-y-0 start-0 flex w-72 flex-col gap-8 p-5">
            <div className="flex items-center justify-between"><Logo />
              <button onClick={() => setOpen(false)} aria-label="close"><X className="h-5 w-5" /></button></div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-3 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="menu"><Menu className="h-6 w-6" /></button>
            <div className="lg:hidden"><Logo /></div>
          </div>
          <LangToggle />
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}

export function SetupBadge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
    <span className="h-1.5 w-1.5 rounded-full bg-warning" />{children}</span>;
}