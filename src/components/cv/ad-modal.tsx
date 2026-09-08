import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dict } from "@/lib/i18n";

interface Props {
  open: boolean;
  d: Dict;
  onCancel: () => void;
  onReward: () => void;
}

const DURATION = 5;

export function RewardedAdModal({ open, d, onCancel, onReward }: Props) {
  const [left, setLeft] = React.useState(DURATION);

  React.useEffect(() => {
    if (!open) return;
    setLeft(DURATION);
    const started = Date.now();
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - started) / 1000;
      setLeft(Math.max(0, DURATION - Math.floor(elapsed)));
    }, 200);
    return () => window.clearInterval(id);
  }, [open]);

  const ready = left === 0;
  const progress = ((DURATION - left) / DURATION) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={d.adTitle}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl"
          >
            <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-primary via-indigo-600 to-emerald-500">
              <button
                onClick={onCancel}
                aria-label={d.adClose}
                className="absolute end-3 top-3 rounded-full bg-black/25 p-1.5 text-white transition hover:bg-black/40"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="absolute start-3 top-3 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                {d.adSponsored}
              </span>
              <motion.div
                animate={{ scale: ready ? 1 : [1, 1.08, 1] }}
                transition={{ repeat: ready ? 0 : Infinity, duration: 1.6 }}
                className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-white"
              >
                {ready ? <Gift className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </motion.div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <h3 className="text-base font-bold text-foreground">{d.adTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.adBody}</p>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.25 }}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!ready}
                onClick={onReward}
              >
                {ready ? d.adClaim : `${d.adSkipIn} ${left}${d.adSeconds}`}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
