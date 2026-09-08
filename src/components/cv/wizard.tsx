import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  GraduationCap,
  ImagePlus,
  Languages as LanguagesIcon,
  Layout,
  Lock,
  Plus,
  Sparkles,
  Trash2,
  User,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useCV } from "@/lib/cv-store";
import { uid, type CVData, type TemplateId } from "@/lib/cv-types";
import { polishSummary } from "@/lib/polish";
import type { Dict, Lang } from "@/lib/i18n";
import { TEMPLATES } from "./templates";

/* ------------------------------ primitives ----------------------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = React.useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background/70"
      />
    </div>
  );
}

function CardItem({
  children,
  onRemove,
  index,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
          {index + 1}
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          aria-label="remove"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-border/70 py-6 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="w-full gap-2 border-dashed">
      <Plus className="h-4 w-4" /> {label}
    </Button>
  );
}

/* -------------------------------- steps -------------------------------- */

export const STEPS = [
  { key: "s_personal", icon: User },
  { key: "s_summary", icon: Sparkles },
  { key: "s_experience", icon: Briefcase },
  { key: "s_education", icon: GraduationCap },
  { key: "s_skills", icon: LanguagesIcon },
  { key: "s_extras", icon: FolderGit2 },
  { key: "s_template", icon: Layout },
] as const;

interface StepProps {
  cv: CVData;
  set: (u: (p: CVData) => CVData) => void;
  d: Dict;
  lang: Lang;
}

function PersonalStep({ cv, set, d }: StepProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const p = cv.personal;
  const upd = (k: keyof CVData["personal"]) => (v: string) =>
    set((prev) => ({ ...prev, personal: { ...prev.personal, [k]: v } }));

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 3_000_000) {
      toast.error("Max 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => upd("avatar")(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-muted">
          {p.avatar ? (
            <img src={p.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">{d.photo}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
              {d.upload}
            </Button>
            {p.avatar && (
              <Button type="button" size="sm" variant="ghost" onClick={() => upd("avatar")("")}>
                {d.remove}
              </Button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={d.fullName} value={p.fullName} onChange={upd("fullName")} placeholder="Amina El Fassi" />
        <Field label={d.jobTitle} value={p.title} onChange={upd("title")} placeholder="Product Designer" />
        <Field label={d.email} value={p.email} onChange={upd("email")} type="email" placeholder="you@mail.com" />
        <Field label={d.phone} value={p.phone} onChange={upd("phone")} placeholder="+212 6 00 00 00 00" />
        <Field label={d.location} value={p.location} onChange={upd("location")} placeholder="Casablanca" />
        <Field label={d.website} value={p.website} onChange={upd("website")} placeholder="portfolio.com" />
      </div>
    </div>
  );
}

function SummaryStep({ cv, set, d, lang }: StepProps) {
  const [busy, setBusy] = React.useState(false);
  const run = () => {
    setBusy(true);
    window.setTimeout(() => {
      set((prev) => ({ ...prev, summary: polishSummary(prev.summary, lang) }));
      setBusy(false);
      toast.success(d.polished);
    }, 1100);
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-semibold text-muted-foreground">{d.summary}</Label>
        <Button type="button" size="sm" onClick={run} disabled={busy} className="gap-2">
          <Wand2 className={cn("h-4 w-4", busy && "animate-spin")} />
          {busy ? d.polishing : d.polish}
        </Button>
      </div>
      <Textarea
        value={cv.summary}
        rows={7}
        onChange={(e) => set((p) => ({ ...p, summary: e.target.value }))}
        placeholder={d.summaryHint}
        className="resize-none bg-background/70 leading-relaxed"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{d.summaryHint}</span>
        <span>{cv.summary.length}</span>
      </div>
    </div>
  );
}

function ExperienceStep({ cv, set, d }: StepProps) {
  const items = cv.experience;
  const upd = (id: string, patch: Partial<(typeof items)[number]>) =>
    set((p) => ({ ...p, experience: p.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((e, i) => (
          <CardItem
            key={e.id}
            index={i}
            onRemove={() => set((p) => ({ ...p, experience: p.experience.filter((x) => x.id !== e.id) }))}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={d.role} value={e.role} onChange={(v) => upd(e.id, { role: v })} />
              <Field label={d.company} value={e.company} onChange={(v) => upd(e.id, { company: v })} />
              <Field label={d.start} value={e.start} onChange={(v) => upd(e.id, { start: v })} placeholder="2021" />
              <Field
                label={d.end}
                value={e.current ? "" : e.end}
                onChange={(v) => upd(e.id, { end: v })}
                placeholder="2024"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={e.current} onCheckedChange={(v) => upd(e.id, { current: v })} id={`cur-${e.id}`} />
              <Label htmlFor={`cur-${e.id}`} className="text-xs text-muted-foreground">
                {d.current}
              </Label>
            </div>
            <Textarea
              rows={3}
              value={e.description}
              placeholder={d.description}
              onChange={(ev) => upd(e.id, { description: ev.target.value })}
              className="resize-none bg-background/70"
            />
          </CardItem>
        ))}
      </AnimatePresence>
      {items.length === 0 && <EmptyState text={d.empty} />}
      <AddButton
        label={d.addExperience}
        onClick={() =>
          set((p) => ({
            ...p,
            experience: [
              ...p.experience,
              { id: uid(), role: "", company: "", start: "", end: "", current: false, description: "" },
            ],
          }))
        }
      />
    </div>
  );
}

function EducationStep({ cv, set, d }: StepProps) {
  const upd = (id: string, patch: Partial<CVData["education"][number]>) =>
    set((p) => ({ ...p, education: p.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {cv.education.map((e, i) => (
          <CardItem
            key={e.id}
            index={i}
            onRemove={() => set((p) => ({ ...p, education: p.education.filter((x) => x.id !== e.id) }))}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={d.degree} value={e.degree} onChange={(v) => upd(e.id, { degree: v })} />
              <Field label={d.school} value={e.school} onChange={(v) => upd(e.id, { school: v })} />
              <Field label={d.start} value={e.start} onChange={(v) => upd(e.id, { start: v })} />
              <Field label={d.end} value={e.end} onChange={(v) => upd(e.id, { end: v })} />
            </div>
            <Textarea
              rows={2}
              value={e.details}
              placeholder={d.details}
              onChange={(ev) => upd(e.id, { details: ev.target.value })}
              className="resize-none bg-background/70"
            />
          </CardItem>
        ))}
      </AnimatePresence>
      {cv.education.length === 0 && <EmptyState text={d.empty} />}
      <AddButton
        label={d.addEducation}
        onClick={() =>
          set((p) => ({
            ...p,
            education: [...p.education, { id: uid(), degree: "", school: "", start: "", end: "", details: "" }],
          }))
        }
      />
    </div>
  );
}

function SkillsStep({ cv, set, d }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {cv.skills.map((s, i) => (
            <CardItem
              key={s.id}
              index={i}
              onRemove={() => set((p) => ({ ...p, skills: p.skills.filter((x) => x.id !== s.id) }))}
            >
              <Field
                label={d.skill}
                value={s.name}
                onChange={(v) =>
                  set((p) => ({ ...p, skills: p.skills.map((x) => (x.id === s.id ? { ...x, name: v } : x)) }))
                }
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{d.level}</span>
                  <span className="font-semibold text-primary">{s.level}/5</span>
                </div>
                <Slider
                  value={[s.level]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={([v]) =>
                    set((p) => ({
                      ...p,
                      skills: p.skills.map((x) => (x.id === s.id ? { ...x, level: v ?? 3 } : x)),
                    }))
                  }
                />
              </div>
            </CardItem>
          ))}
        </AnimatePresence>
        {cv.skills.length === 0 && <EmptyState text={d.empty} />}
        <AddButton
          label={d.addSkill}
          onClick={() => set((p) => ({ ...p, skills: [...p.skills, { id: uid(), name: "", level: 3 }] }))}
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {cv.languages.map((l, i) => (
            <CardItem
              key={l.id}
              index={i}
              onRemove={() => set((p) => ({ ...p, languages: p.languages.filter((x) => x.id !== l.id) }))}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label={d.language}
                  value={l.name}
                  onChange={(v) =>
                    set((p) => ({
                      ...p,
                      languages: p.languages.map((x) => (x.id === l.id ? { ...x, name: v } : x)),
                    }))
                  }
                />
                <Field
                  label={d.level}
                  value={l.level}
                  onChange={(v) =>
                    set((p) => ({
                      ...p,
                      languages: p.languages.map((x) => (x.id === l.id ? { ...x, level: v } : x)),
                    }))
                  }
                />
              </div>
            </CardItem>
          ))}
        </AnimatePresence>
        {cv.languages.length === 0 && <EmptyState text={d.empty} />}
        <AddButton
          label={d.addLanguage}
          onClick={() => set((p) => ({ ...p, languages: [...p.languages, { id: uid(), name: "", level: "" }] }))}
        />
      </div>
    </div>
  );
}

function ExtrasStep({ cv, set, d }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {cv.projects.map((pr, i) => (
            <CardItem
              key={pr.id}
              index={i}
              onRemove={() => set((p) => ({ ...p, projects: p.projects.filter((x) => x.id !== pr.id) }))}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label={d.projectName}
                  value={pr.name}
                  onChange={(v) =>
                    set((p) => ({ ...p, projects: p.projects.map((x) => (x.id === pr.id ? { ...x, name: v } : x)) }))
                  }
                />
                <Field
                  label={d.link}
                  value={pr.link}
                  onChange={(v) =>
                    set((p) => ({ ...p, projects: p.projects.map((x) => (x.id === pr.id ? { ...x, link: v } : x)) }))
                  }
                />
              </div>
              <Textarea
                rows={2}
                value={pr.description}
                placeholder={d.description}
                className="resize-none bg-background/70"
                onChange={(ev) =>
                  set((p) => ({
                    ...p,
                    projects: p.projects.map((x) => (x.id === pr.id ? { ...x, description: ev.target.value } : x)),
                  }))
                }
              />
            </CardItem>
          ))}
        </AnimatePresence>
        {cv.projects.length === 0 && <EmptyState text={d.empty} />}
        <AddButton
          label={d.addProject}
          onClick={() =>
            set((p) => ({ ...p, projects: [...p.projects, { id: uid(), name: "", link: "", description: "" }] }))
          }
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {cv.certifications.map((c, i) => (
            <CardItem
              key={c.id}
              index={i}
              onRemove={() =>
                set((p) => ({ ...p, certifications: p.certifications.filter((x) => x.id !== c.id) }))
              }
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field
                  label={d.certification}
                  value={c.name}
                  onChange={(v) =>
                    set((p) => ({
                      ...p,
                      certifications: p.certifications.map((x) => (x.id === c.id ? { ...x, name: v } : x)),
                    }))
                  }
                />
                <Field
                  label={d.issuer}
                  value={c.issuer}
                  onChange={(v) =>
                    set((p) => ({
                      ...p,
                      certifications: p.certifications.map((x) => (x.id === c.id ? { ...x, issuer: v } : x)),
                    }))
                  }
                />
                <Field
                  label={d.year}
                  value={c.year}
                  onChange={(v) =>
                    set((p) => ({
                      ...p,
                      certifications: p.certifications.map((x) => (x.id === c.id ? { ...x, year: v } : x)),
                    }))
                  }
                />
              </div>
            </CardItem>
          ))}
        </AnimatePresence>
        {cv.certifications.length === 0 && <EmptyState text={d.empty} />}
        <AddButton
          label={d.addCertification}
          onClick={() =>
            set((p) => ({
              ...p,
              certifications: [...p.certifications, { id: uid(), name: "", issuer: "", year: "" }],
            }))
          }
        />
      </div>
    </div>
  );
}

function TemplateStep({
  cv,
  set,
  d,
  lang,
  unlocked,
  onRequestUnlock,
}: StepProps & { unlocked: TemplateId[]; onRequestUnlock: (id: TemplateId) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {TEMPLATES.map((tpl) => {
        const locked = tpl.premium && !unlocked.includes(tpl.id);
        const active = cv.template === tpl.id;
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() =>
              locked ? onRequestUnlock(tpl.id) : set((p) => ({ ...p, template: tpl.id }))
            }
            className={cn(
              "group relative overflow-hidden rounded-2xl border p-4 text-start transition-all",
              active
                ? "border-primary bg-primary/5 shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                : "border-border/70 bg-card/60 hover:border-primary/50 hover:bg-card",
            )}
          >
            <div className="flex items-center gap-1.5">
              {tpl.swatch.map((c) => (
                <span
                  key={c}
                  className="h-6 w-6 rounded-lg border border-black/5"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-foreground">{tpl.name[lang]}</span>
              {active && <Check className="h-4 w-4 text-primary" />}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              {tpl.premium && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    locked ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600",
                  )}
                >
                  {locked ? <Lock className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                  {locked ? d.premium : d.unlocked}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------- wizard -------------------------------- */

export function Wizard({
  d,
  lang,
  step,
  setStep,
  onRequestUnlock,
}: {
  d: Dict;
  lang: Lang;
  step: number;
  setStep: (n: number) => void;
  onRequestUnlock: (id: TemplateId) => void;
}) {
  const { cv, setCV, unlocked } = useCV();
  const props: StepProps = { cv, set: setCV, d, lang };
  const Prev = lang === "ar" ? ChevronRight : ChevronLeft;
  const Next = lang === "ar" ? ChevronLeft : ChevronRight;

  const body = [
    <PersonalStep key="0" {...props} />,
    <SummaryStep key="1" {...props} />,
    <ExperienceStep key="2" {...props} />,
    <EducationStep key="3" {...props} />,
    <SkillsStep key="4" {...props} />,
    <ExtrasStep key="5" {...props} />,
    <TemplateStep key="6" {...props} unlocked={unlocked} onRequestUnlock={onRequestUnlock} />,
  ][step];

  return (
    <div className="space-y-5">
      {/* step rail */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : done
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                    : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              {d[s.key]}
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-foreground">{d[STEPS[step]!.key]}</h2>
          <span className="text-xs font-medium text-muted-foreground">
            {d.step} {step + 1} {d.of} {STEPS.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2 }}
          >
            {body}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep(Math.max(0, step - 1))}
            className="gap-1"
          >
            <Prev className="h-4 w-4" /> {d.back}
          </Button>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-border",
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            disabled={step === STEPS.length - 1}
            onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
            className="gap-1"
          >
            {step === STEPS.length - 2 ? d.finish : d.next} <Next className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Award className="h-3.5 w-3.5 text-emerald-500" /> {d.saved}
      </p>
    </div>
  );
}
