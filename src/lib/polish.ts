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

const FR_CLOSERS = [
  "Reconnu pour livrer des résultats mesurables et élever le niveau de qualité de toute l'équipe.",
  "À l'aise pour prendre en charge des sujets ambigus de bout en bout, avec une communication claire.",
  "Allie savoir-faire opérationnel et sens pragmatique des résultats business.",
];

const FR_WEAK: Array<[RegExp, string]> = [
  [/\bresponsable de\b/gi, "pilote de"],
  [/\bj'ai aidé à\b/gi, "j'ai piloté"],
  [/\bj'ai travaillé sur\b/gi, "j'ai livré"],
  [/\ben charge de\b/gi, "pilote de"],
  [/\btrès\s+/gi, ""],
  [/\bparticipé à\b/gi, "contribué activement à"],
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
    if (lang === "ar")
      return "محترف يجمع بين الخبرة العملية والتفكير التحليلي، مع سجل في تسليم مشاريع ذات أثر واضح والعمل ضمن فرق متعددة التخصصات.";
    if (lang === "fr")
      return `Professionnel orienté résultats, capable de transformer des problèmes complexes en réalisations concrètes et mesurables. ${pick(FR_CLOSERS)}`;
    return `${pick(EN_OPENERS)} professional with a track record of turning complex problems into shipped, measurable work. ${pick(EN_CLOSERS)}`;
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
  } else if (lang === "fr") {
    for (const [re, rep] of FR_WEAK) text = text.replace(re, rep);
    text = text.replace(/(^|[.!?]\s+)([a-zà-ÿ])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase());
    if (!/[.!?]$/.test(text)) text += ".";
    if (text.length < 170) text += " " + pick(FR_CLOSERS);
  } else {
    if (!/[.؟!]$/.test(text)) text += ".";
    if (text.length < 160) text += " " + pick(AR_CLOSERS);
  }
  return text;
}
