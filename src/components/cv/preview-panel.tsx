import * as React from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CVDocument, A4_W, A4_H } from "./templates";
import type { CVData } from "@/lib/cv-types";
import type { Dict, Lang } from "@/lib/i18n";

export type PreviewDevice = "desktop" | "mobile";

export function PreviewPanel({
  cv,
  d,
  lang,
  device,
  setDevice,
  onDownload,
  exporting,
}: {
  cv: CVData;
  d: Dict;
  lang: Lang;
  device: PreviewDevice;
  setDevice: (v: PreviewDevice) => void;
  onDownload: () => void;
  exporting: boolean;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.5);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const avail = el.clientWidth - 8;
      const target = device === "mobile" ? Math.min(avail, 390) : avail;
      setScale(Math.max(0.2, Math.min(1, target / A4_W)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [device]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-border/70 bg-card/70 p-1 backdrop-blur">
          {(["desktop", "mobile"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setDevice(v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                device === v
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v === "desktop" ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
              {v === "desktop" ? d.desktopView : d.mobileView}
            </button>
          ))}
        </div>
        <Button onClick={onDownload} disabled={exporting} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden xs:inline sm:inline">{exporting ? d.preparing : d.download}</span>
        </Button>
      </div>

      <div
        ref={wrapRef}
        className="flex-1 overflow-auto rounded-3xl border border-border/60 bg-slate-200/50 p-2 shadow-inner"
      >
        <motion.div
          layout
          className="mx-auto"
          style={{ width: A4_W * scale, height: A4_H * scale }}
        >
          <div
            style={{
              width: A4_W,
              height: A4_H,
              transform: `scale(${scale})`,
              transformOrigin: lang === "ar" ? "top right" : "top left",
              boxShadow: "0 20px 45px -20px rgba(15,23,42,0.45)",
              borderRadius: 6,
              overflow: "hidden",
              background: "#fff",
              marginInlineStart: lang === "ar" ? "auto" : undefined,
            }}
          >
            <CVDocument cv={cv} d={d} lang={lang} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
