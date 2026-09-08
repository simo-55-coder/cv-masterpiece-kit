import type { Lang } from "./i18n";

const EN_OPENERS = [
  "Results-driven",
  "Impact-focused",
  "Detail-oriented",
  "Outcome-driven",
];

const EN_CLOSERS = [
  "Known for shipping measurable outcomes and raising the quality bar for the whole team.",
  "Comfortable owning ambiguous problems end to end and communicating clearly with stakeholders.",
  "Combines hands-on craft with a pragmatic focus on business results.",
];

const AR_CLOSERS = [
  "معروف بتحقيق نتائج قابلة للقياس ورفع مستوى جودة العمل داخل الفريق.",
  "يمتلك القدرة على قيادة المهام المعقدة من البداية حتى التسليم بتواصل واضح.",
  "يجمع بين الإتقان العملي والتركيز على نتائج الأعمال.",
];

const WEAK: Array<[RegExp, string]> = [
  [/\bresponsible for\b/gi, "led"],
  [/\bhelped to\b/gi, "drove"],
  [/\bhelped\b/gi, "drove"],
  [/\bworked on\b/gi, "delivered"],
  [/\bin charge of\b/gi, "owned"],
  [/\bvery\s+/gi, ""],
  [/\bassisted with\b/gi, "supported"],
  [/\bduties included\b/gi, "delivered"],
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;

/** Simulated "AI" rewrite: deterministic-ish cleanup + stronger phrasing. */
export function polishSummary(input: string, lang: Lang): string {
  const raw = input.trim();
  if (!raw) {
    return lang === "ar"
      ? "محترف يجمع بين الخبرة العملية والتفكير التحليلي، مع سجل في تسليم مشاريع ذات أثر واضح والعمل ضمن فرق متعددة التخصصات."
      : `${pick(EN_OPENERS)} professional with a track record of turning complex problems into shipped, measurable work. ${pick(EN_CLOSERS)}`;
  }

  let text = raw.replace(/\s+/g, " ");
  if (lang === "en") {
    for (const [re, rep] of WEAK) text = text.replace(re, rep);
    text = text.replace(/(^|[.!?]\s+)([a-z])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase());
    if (!/[.!?]$/.test(text)) text += ".";
    if (text.split(/[.!?]/).filter((s) => s.trim()).length < 3) {
      text += " " + pick(EN_CLOSERS);
    }
    if (!EN_OPENERS.some((o) => text.startsWith(o))) {
      text = `${pick(EN_OPENERS)} professional. ${text}`;
    }
  } else {
    if (!/[.؟!]$/.test(text)) text += ".";
    if (text.length < 160) text += " " + pick(AR_CLOSERS);
  }
  return text;
}
