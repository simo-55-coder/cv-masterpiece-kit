import type { Dict } from "@/lib/i18n";

export function AdBanner({ d }: { d: Dict }) {
  return (
    <div
      id="admob-banner-slot"
      role="complementary"
      aria-label={d.adSponsored}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[56px] items-center justify-center border-t border-border/60 bg-slate-900/95 backdrop-blur sm:h-[64px]"
    >
      <div className="flex w-full max-w-[728px] items-center justify-between px-4">
        <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
          {d.adSponsored}
        </span>
        <span className="text-xs font-medium text-slate-400 sm:text-sm">
          {d.adPlaceholder} · 320×50 / 728×90
        </span>
        <span className="text-[10px] text-slate-500">AdMob</span>
      </div>
    </div>
  );
}
