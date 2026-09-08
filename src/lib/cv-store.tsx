import * as React from "react";
import { emptyCV, type CVData, type TemplateId } from "./cv-types";
import type { Lang } from "./i18n";

const KEY = "smart-cv-builder:v1";

interface Persisted {
  cv: CVData;
  lang: Lang;
  unlocked: TemplateId[];
  exportUnlocked: boolean;
}

interface Store extends Persisted {
  setCV: (updater: (prev: CVData) => CVData) => void;
  replaceCV: (cv: CVData) => void;
  setLang: (l: Lang) => void;
  unlockTemplate: (id: TemplateId) => void;
  setExportUnlocked: (v: boolean) => void;
  hydrated: boolean;
}

const Ctx = React.createContext<Store | null>(null);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cv, setCVState] = React.useState<CVData>(emptyCV);
  const [lang, setLangState] = React.useState<Lang>("en");
  const [unlocked, setUnlocked] = React.useState<TemplateId[]>([]);
  const [exportUnlocked, setExportUnlocked] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        if (p.cv) setCVState({ ...emptyCV(), ...p.cv });
        if (p.lang) setLangState(p.lang);
        if (p.unlocked) setUnlocked(p.unlocked);
        if (p.exportUnlocked) setExportUnlocked(true);
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ cv, lang, unlocked, exportUnlocked }));
    } catch {
      /* quota */
    }
  }, [cv, lang, unlocked, exportUnlocked, hydrated]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value: Store = {
    cv,
    lang,
    unlocked,
    exportUnlocked,
    hydrated,
    setCV: (updater) => setCVState((prev) => updater(prev)),
    replaceCV: (next) => setCVState(next),
    setLang: setLangState,
    unlockTemplate: (id) => setUnlocked((u) => (u.includes(id) ? u : [...u, id])),
    setExportUnlocked,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCV() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCV must be used inside CVProvider");
  return ctx;
}

export function completeness(cv: CVData) {
  const checks = [
    !!cv.personal.fullName,
    !!cv.personal.title,
    !!cv.personal.email,
    !!cv.personal.phone,
    !!cv.personal.location,
    cv.summary.length > 40,
    cv.experience.length > 0,
    cv.education.length > 0,
    cv.skills.length > 2,
    cv.languages.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
