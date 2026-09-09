import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Globe, RotateCcw, Sparkles } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CVProvider, useCV, completeness } from "@/lib/cv-store";
import { emptyCV, sampleCV, type TemplateId } from "@/lib/cv-types";
import { t } from "@/lib/i18n";
import { Wizard } from "@/components/cv/wizard";
import { PreviewPanel, type PreviewDevice } from "@/components/cv/preview-panel";
import { CVDocument } from "@/components/cv/templates";
import { RewardedAdModal } from "@/components/cv/ad-modal";
import { AdBanner } from "@/components/cv/ad-banner";
import { exportNodeToPdf } from "@/lib/export-pdf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart CV Builder — Free Bilingual Resume Maker (EN/AR)" },
      {
        name: "description",
        content:
          "Build a professional CV in English or Arabic with live preview, four templates and instant A4 PDF export. Works on mobile, saves automatically.",
      },
      { property: "og:title", content: "Smart CV Builder — Free Bilingual Resume Maker" },
      {
        property: "og:description",
        content: "Multi-step CV wizard, RTL Arabic support, live preview and one-tap A4 PDF export.",
      },
    ],
  }),
  component: () => (
    <CVProvider>
      <App />
    </CVProvider>
  ),
});

function App() {
  const { cv, lang, setLang, replaceCV, unlocked, unlockTemplate, exportUnlocked, setExportUnlocked, hydrated } =
    useCV();
  const d = t(lang);
  const [step, setStep] = React.useState(0);
  const [tab, setTab] = React.useState<"edit" | "preview">("edit");
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [exporting, setExporting] = React.useState(false);
  const [ad, setAd] = React.useState<null | { type: "pdf" } | { type: "template"; id: TemplateId }>(null);
  const exportRef = React.useRef<HTMLDivElement>(null);

  const pct = completeness(cv);

  const runExport = React.useCallback(async () => {
    const node = exportRef.current;
    if (!node) return;
    setExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 60));
      const name = (cv.personal.fullName || "my-cv").replace(/\s+/g, "-").toLowerCase();
      await exportNodeToPdf(node, `${name}.pdf`);
      toast.success(d.downloaded);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [cv.personal.fullName, d.downloaded]);

  const handleDownload = () => {
    if (exportUnlocked) void runExport();
    else setAd({ type: "pdf" });
  };

  const claim = () => {
    if (!ad) return;
    if (ad.type === "pdf") {
      setExportUnlocked(true);
      setAd(null);
      void runExport();
    } else {
      unlockTemplate(ad.id);
      replaceCV({ ...cv, template: ad.id });
      setAd(null);
      toast.success(d.unlocked);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,var(--background))_0%,var(--background)_55%)] pb-[72px]">
      <Toaster position="top-center" richColors />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white shadow-lg shadow-primary/25">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                {d.appName}
              </h1>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{d.tagline}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
            </div>
            <div className="inline-flex rounded-xl border border-border/70 bg-card/70 p-0.5">
              {([
                { id: "en", label: "EN" },
                { id: "fr", label: "FR" },
                { id: "ar", label: "AR" },
              ] as const).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs font-bold transition",
                    lang === l.id
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden gap-1.5 sm:inline-flex"
              onClick={() => {
                replaceCV(sampleCV());
                toast.success(d.sampleDone);
              }}
            >
              <Sparkles className="h-4 w-4" /> {d.loadSample}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={d.reset}
              onClick={() => {
                replaceCV(emptyCV());
                setStep(0);
                toast.success(d.resetDone);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* mobile tabs */}
        <div className="mx-auto flex max-w-[1400px] gap-1 px-4 pb-3 lg:hidden">
          {(["edit", "preview"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTab(v)}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
                tab === v
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card/70 text-muted-foreground",
              )}
            >
              {v === "edit" ? d.edit : d.preview}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-5">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className={cn(tab === "edit" ? "block" : "hidden", "lg:block")}>
            <Wizard
              d={d}
              lang={lang}
              step={step}
              setStep={setStep}
              onRequestUnlock={(id) => setAd({ type: "template", id })}
            />
          </section>
          <section
            className={cn(
              tab === "preview" ? "block" : "hidden",
              "lg:sticky lg:top-[92px] lg:block lg:h-[calc(100vh-180px)]",
            )}
          >
            <PreviewPanel
              cv={cv}
              d={d}
              lang={lang}
              device={device}
              setDevice={setDevice}
              onDownload={handleDownload}
              exporting={exporting}
            />
          </section>
        </div>
      </main>

      {/* offscreen full-size node used for PDF capture */}
      <div style={{ position: "fixed", top: 0, left: -20000, opacity: hydrated ? 1 : 0, pointerEvents: "none" }}>
        <div ref={exportRef}>
          <CVDocument cv={cv} d={d} lang={lang} />
        </div>
      </div>

      <RewardedAdModal open={!!ad} d={d} onCancel={() => setAd(null)} onReward={claim} />
      <AdBanner d={d} />
      {unlocked.length > 0 ? null : null}
    </div>
  );
}
