import * as React from "react";
import type { CVData, TemplateId } from "@/lib/cv-types";
import type { Dict, Lang } from "@/lib/i18n";

export const A4_W = 794;
export const A4_H = 1123;

const INK = "#0F172A";
const MUTED = "#64748B";
const INDIGO = "#4F46E5";
const EMERALD = "#10B981";
const LINE = "#E2E8F0";

/* spacing / line-height helpers driven by the auto-fill variables */
const sp = (n: number) => `calc(${n}px * var(--fill, 1))`;
const lh = (n: number) => `calc(${n} * var(--lh, 1))`;
const pad = (v: string, h: string) => `${sp(Number(v))} ${sp(Number(h))}`;

interface TProps {
  cv: CVData;
  d: Dict;
  lang: Lang;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function dates(a: string, b: string, current: boolean, d: Dict) {
  const end = current ? d.present : b;
  return [a, end].filter(Boolean).join(" — ");
}

const contactLine = (p: CVData["personal"], sep: string) =>
  [p.email, p.phone, p.location, p.website].filter(Boolean).join(sep);

function Avatar({ src, size, radius }: { src: string; size: number; radius: number }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", display: "block" }}
    />
  );
}

/* ----------------------------- shared bits ----------------------------- */
function Block({ title, children, light }: { title: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ marginTop: sp(24) }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color: light ? "#A5B4FC" : MUTED,
          marginBottom: sp(9),
          fontWeight: 700,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Section({
  title,
  children,
  accent,
  centered,
  rule,
}: {
  title: string;
  children: React.ReactNode;
  accent: string;
  lang?: Lang;
  centered?: boolean;
  rule?: boolean;
}) {
  return (
    <section style={{ marginBottom: sp(18) }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          color: accent,
          marginBottom: sp(9),
          textAlign: centered ? "center" : undefined,
          borderBottom: rule ? `1px solid ${LINE}` : undefined,
          paddingBottom: rule ? sp(5) : undefined,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function Body({ text, color, dir = "auto" }: { text: string; color: string; dir?: string }) {
  if (!text) return null;
  return (
    <div style={{ marginTop: sp(4) }} dir={dir}>
      {text
        .split("\n")
        .filter(Boolean)
        .map((line, i) => (
          <div key={i} style={{ fontSize: 11.5, lineHeight: lh(1.6), color, marginBottom: sp(3) }}>
            {line}
          </div>
        ))}
    </div>
  );
}

function Entry({
  title,
  sub,
  meta,
  body,
  accent = INDIGO,
}: {
  title: string;
  sub: string;
  meta: string;
  body: string;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: sp(13) }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: INK, lineHeight: lh(1.35) }}>{title}</span>
        {meta ? <span style={{ fontSize: 10.5, color: MUTED, whiteSpace: "nowrap" }}>{meta}</span> : null}
      </div>
      {sub ? <div style={{ fontSize: 11.5, color: accent, marginTop: sp(2) }}>{sub}</div> : null}
      <Body text={body} color="#475569" />
    </div>
  );
}

function CertList({ cv, color = "#334155" }: { cv: CVData; color?: string }) {
  return (
    <>
      {cv.certifications.map((c) => (
        <div key={c.id} style={{ fontSize: 12, marginBottom: sp(4), color, lineHeight: lh(1.5) }}>
          {[c.name, c.issuer, c.year].filter(Boolean).join(" · ")}
        </div>
      ))}
    </>
  );
}

/* ------------------------------- Modern -------------------------------- */
function Modern({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ display: "flex", minHeight: A4_H, background: "#FFFFFF", color: INK }}>
      <aside
        style={{
          width: 268,
          background: "linear-gradient(180deg,#4F46E5 0%,#3730A3 100%)",
          color: "#EEF2FF",
          padding: pad("34", "26"),
        }}
      >
        {p.avatar ? (
          <div style={{ marginBottom: sp(18) }}>
            <Avatar src={p.avatar} size={92} radius={999} />
          </div>
        ) : null}
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: lh(1.15), color: "#FFFFFF" }}>
          {p.fullName || "—"}
        </div>
        <div style={{ fontSize: 13, marginTop: sp(6), color: "#C7D2FE" }}>{p.title}</div>

        <Block title={d.contact} light>
          {[p.email, p.phone, p.location, p.website].filter(Boolean).map((x) => (
            <div key={x} style={{ fontSize: 11.5, marginBottom: sp(6), wordBreak: "break-word", lineHeight: lh(1.5) }}>
              {x}
            </div>
          ))}
        </Block>

        {cv.skills.length > 0 && (
          <Block title={d.skills} light>
            {cv.skills.map((s) => (
              <div key={s.id} style={{ marginBottom: sp(9) }}>
                <div style={{ fontSize: 11.5, marginBottom: sp(4) }}>{s.name}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {range(5).map((i) => (
                    <span
                      key={i}
                      style={{
                        height: 4,
                        flex: 1,
                        borderRadius: 4,
                        background: i < s.level ? "#A5B4FC" : "rgba(255,255,255,0.22)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Block>
        )}

        {cv.languages.length > 0 && (
          <Block title={d.languages} light>
            {cv.languages.map((l) => (
              <div
                key={l.id}
                style={{ fontSize: 11.5, display: "flex", justifyContent: "space-between", marginBottom: sp(5) }}
              >
                <span>{l.name}</span>
                <span style={{ color: "#C7D2FE" }}>{l.level}</span>
              </div>
            ))}
          </Block>
        )}
      </aside>

      <main style={{ flex: 1, padding: pad("36", "34") }}>
        {cv.summary && (
          <Section title={d.profile} accent={INDIGO} lang={lang}>
            <p style={{ fontSize: 12, lineHeight: lh(1.65), color: "#334155", margin: 0 }}>{cv.summary}</p>
          </Section>
        )}
        {cv.experience.length > 0 && (
          <Section title={d.experience} accent={INDIGO} lang={lang}>
            {cv.experience.map((e) => (
              <Entry
                key={e.id}
                title={e.role}
                sub={e.company}
                meta={dates(e.start, e.end, e.current, d)}
                body={e.description}
              />
            ))}
          </Section>
        )}
        {cv.education.length > 0 && (
          <Section title={d.education} accent={INDIGO} lang={lang}>
            {cv.education.map((e) => (
              <Entry key={e.id} title={e.degree} sub={e.school} meta={dates(e.start, e.end, false, d)} body={e.details} />
            ))}
          </Section>
        )}
        {cv.projects.length > 0 && (
          <Section title={d.projects} accent={INDIGO} lang={lang}>
            {cv.projects.map((e) => (
              <Entry key={e.id} title={e.name} sub={e.link} meta="" body={e.description} />
            ))}
          </Section>
        )}
        {cv.certifications.length > 0 && (
          <Section title={d.certifications} accent={INDIGO} lang={lang}>
            <CertList cv={cv} />
          </Section>
        )}
      </main>
    </div>
  );
}

/* ------------------------------ Executive ------------------------------ */
function Executive({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ background: "#FFFFFF", color: INK, padding: pad("42", "48"), minHeight: A4_H }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          borderBottom: `3px solid ${INK}`,
          paddingBottom: sp(16),
        }}
      >
        <Avatar src={p.avatar} size={78} radius={8} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.5px", lineHeight: lh(1.15) }}>
            {p.fullName || "—"}
          </div>
          <div style={{ fontSize: 13, color: EMERALD, fontWeight: 600, marginTop: sp(4) }}>{p.title}</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: sp(7), lineHeight: lh(1.5) }}>
            {contactLine(p, "  ·  ")}
          </div>
        </div>
      </header>

      <div style={{ marginTop: sp(20) }}>
        {cv.summary && (
          <Section title={d.profile} accent={INK} lang={lang}>
            <p style={{ fontSize: 12, lineHeight: lh(1.7), color: "#334155", margin: 0 }}>{cv.summary}</p>
          </Section>
        )}
        {cv.experience.length > 0 && (
          <Section title={d.experience} accent={INK} lang={lang}>
            {cv.experience.map((e) => (
              <Entry
                key={e.id}
                title={`${e.role}${e.company ? `, ${e.company}` : ""}`}
                sub=""
                meta={dates(e.start, e.end, e.current, d)}
                body={e.description}
              />
            ))}
          </Section>
        )}
        {cv.education.length > 0 && (
          <Section title={d.education} accent={INK} lang={lang}>
            {cv.education.map((e) => (
              <Entry
                key={e.id}
                title={`${e.degree}${e.school ? `, ${e.school}` : ""}`}
                sub=""
                meta={dates(e.start, e.end, false, d)}
                body={e.details}
              />
            ))}
          </Section>
        )}
        <div style={{ display: "flex", gap: 28 }}>
          {cv.skills.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.skills} accent={INK} lang={lang}>
                {cv.skills.map((s) => (
                  <div key={s.id} style={{ fontSize: 12, color: "#334155", marginBottom: sp(4), lineHeight: lh(1.5) }}>
                    • {s.name}
                  </div>
                ))}
              </Section>
            </div>
          )}
          {cv.languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.languages} accent={INK} lang={lang}>
                {cv.languages.map((l) => (
                  <div key={l.id} style={{ fontSize: 12, color: "#334155", marginBottom: sp(4), lineHeight: lh(1.5) }}>
                    • {l.name} — {l.level}
                  </div>
                ))}
              </Section>
            </div>
          )}
        </div>
        {cv.projects.length > 0 && (
          <Section title={d.projects} accent={INK} lang={lang}>
            {cv.projects.map((e) => (
              <Entry key={e.id} title={e.name} sub={e.link} meta="" body={e.description} />
            ))}
          </Section>
        )}
        {cv.certifications.length > 0 && (
          <Section title={d.certifications} accent={INK} lang={lang}>
            <CertList cv={cv} />
          </Section>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Tech -------------------------------- */
function Tech({ cv, d, lang }: TProps) {
  const p = cv.personal;
  const label = (s: string) => (
    <div
      style={{
        fontSize: 9.5,
        letterSpacing: "1.6px",
        textTransform: "uppercase",
        color: MUTED,
        marginBottom: sp(8),
      }}
    >
      {s}
    </div>
  );
  return (
    <div
      style={{
        background: "#0F172A",
        color: "#E2E8F0",
        minHeight: A4_H,
        padding: pad("42", "46"),
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar src={p.avatar} size={72} radius={6} />
        <div>
          <div style={{ fontSize: 27, fontWeight: 700, color: "#FFFFFF", lineHeight: lh(1.2) }}>{p.fullName || "—"}</div>
          <div style={{ fontSize: 12, color: EMERALD, marginTop: sp(5) }}>{p.title}</div>
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: sp(14), lineHeight: lh(1.8) }}>
        {contactLine(p, "   /   ")}
      </div>
      <div style={{ height: 1, background: "#1E293B", margin: `${sp(20)} 0` }} />

      {cv.summary && (
        <div style={{ marginBottom: sp(20) }}>
          {label(d.profile)}
          <p style={{ fontSize: 11.5, lineHeight: lh(1.75), color: "#CBD5E1", margin: 0 }}>{cv.summary}</p>
        </div>
      )}
      {cv.experience.length > 0 && (
        <div style={{ marginBottom: sp(20) }}>
          {label(d.experience)}
          {cv.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: sp(13) }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 12.5, color: "#FFFFFF", fontWeight: 600 }}>{e.role}</span>
                <span style={{ fontSize: 10.5, color: EMERALD }}>{dates(e.start, e.end, e.current, d)}</span>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: sp(2) }}>{e.company}</div>
              <Body text={e.description} color="#CBD5E1" dir={lang === "ar" ? "rtl" : "ltr"} />
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 26 }}>
        {cv.education.length > 0 && (
          <div style={{ flex: 1 }}>
            {label(d.education)}
            {cv.education.map((e) => (
              <div key={e.id} style={{ marginBottom: sp(10) }}>
                <div style={{ fontSize: 11.5, color: "#FFFFFF" }}>{e.degree}</div>
                <div style={{ fontSize: 10.5, color: "#94A3B8", lineHeight: lh(1.5) }}>
                  {e.school} {dates(e.start, e.end, false, d)}
                </div>
              </div>
            ))}
          </div>
        )}
        {cv.skills.length > 0 && (
          <div style={{ flex: 1 }}>
            {label(d.skills)}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cv.skills.map((s) => (
                <span
                  key={s.id}
                  style={{
                    fontSize: 10,
                    border: "1px solid #334155",
                    borderRadius: 4,
                    padding: "3px 7px",
                    color: "#CBD5E1",
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {(cv.languages.length > 0 || cv.certifications.length > 0 || cv.projects.length > 0) && (
        <div style={{ marginTop: sp(20) }}>
          {cv.projects.length > 0 && (
            <>
              {label(d.projects)}
              {cv.projects.map((e) => (
                <div key={e.id} style={{ marginBottom: sp(8) }}>
                  <span style={{ fontSize: 11.5, color: "#FFFFFF" }}>{e.name}</span>
                  <span style={{ fontSize: 10.5, color: "#94A3B8" }}>{e.link ? ` — ${e.link}` : ""}</span>
                  <div style={{ fontSize: 10.5, color: "#CBD5E1", lineHeight: lh(1.6) }}>{e.description}</div>
                </div>
              ))}
            </>
          )}
          {cv.languages.length > 0 && (
            <div style={{ marginTop: sp(14) }}>
              {label(d.languages)}
              <div style={{ fontSize: 11, color: "#CBD5E1", lineHeight: lh(1.6) }}>
                {cv.languages.map((l) => `${l.name} (${l.level})`).join("  ·  ")}
              </div>
            </div>
          )}
          {cv.certifications.length > 0 && (
            <div style={{ marginTop: sp(14) }}>
              {label(d.certifications)}
              <div style={{ fontSize: 11, color: "#CBD5E1", lineHeight: lh(1.6) }}>
                {cv.certifications.map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(" ")).join("  ·  ")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Elegant ------------------------------- */
function Elegant({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ background: "#FFFFFF", minHeight: A4_H, color: INK }}>
      <div
        style={{
          background: "#F8FAFC",
          borderBottom: `1px solid ${LINE}`,
          padding: `${sp(38)} ${sp(48)} ${sp(28)}`,
          textAlign: "center",
        }}
      >
        {p.avatar ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: sp(13) }}>
            <div style={{ padding: 3, borderRadius: 999, background: `linear-gradient(135deg,${INDIGO},${EMERALD})` }}>
              <Avatar src={p.avatar} size={86} radius={999} />
            </div>
          </div>
        ) : null}
        <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: "2px", textTransform: "uppercase", lineHeight: lh(1.2) }}>
          {p.fullName || "—"}
        </div>
        <div style={{ width: 46, height: 2, background: EMERALD, margin: `${sp(11)} auto` }} />
        <div style={{ fontSize: 12.5, color: INDIGO, letterSpacing: "1px", fontWeight: 600 }}>{p.title}</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: sp(9), lineHeight: lh(1.6) }}>
          {contactLine(p, "   •   ")}
        </div>
      </div>

      <div style={{ padding: pad("26", "48") }}>
        {cv.summary && (
          <p
            style={{
              fontSize: 12.5,
              lineHeight: lh(1.8),
              color: "#334155",
              textAlign: "center",
              margin: `0 0 ${sp(22)}`,
              fontStyle: "italic",
            }}
          >
            {cv.summary}
          </p>
        )}
        {cv.experience.length > 0 && (
          <Section title={d.experience} accent={EMERALD} lang={lang} centered>
            {cv.experience.map((e) => (
              <Entry
                key={e.id}
                title={e.role}
                sub={e.company}
                meta={dates(e.start, e.end, e.current, d)}
                body={e.description}
              />
            ))}
          </Section>
        )}
        {cv.education.length > 0 && (
          <Section title={d.education} accent={EMERALD} lang={lang} centered>
            {cv.education.map((e) => (
              <Entry key={e.id} title={e.degree} sub={e.school} meta={dates(e.start, e.end, false, d)} body={e.details} />
            ))}
          </Section>
        )}
        <div style={{ display: "flex", gap: 30 }}>
          {cv.skills.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.skills} accent={EMERALD} lang={lang} centered>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cv.skills.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        fontSize: 10.5,
                        background: "#EEF2FF",
                        color: "#3730A3",
                        borderRadius: 999,
                        padding: "4px 10px",
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </Section>
            </div>
          )}
          {cv.languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.languages} accent={EMERALD} lang={lang} centered>
                {cv.languages.map((l) => (
                  <div key={l.id} style={{ fontSize: 11.5, color: "#334155", marginBottom: sp(4) }}>
                    {l.name} — <span style={{ color: MUTED }}>{l.level}</span>
                  </div>
                ))}
              </Section>
            </div>
          )}
        </div>
        {cv.projects.length > 0 && (
          <Section title={d.projects} accent={EMERALD} lang={lang} centered>
            {cv.projects.map((e) => (
              <Entry key={e.id} title={e.name} sub={e.link} meta="" body={e.description} />
            ))}
          </Section>
        )}
        {cv.certifications.length > 0 && (
          <Section title={d.certifications} accent={EMERALD} lang={lang} centered>
            <CertList cv={cv} />
          </Section>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Minimal ------------------------------- */
function Minimal({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ background: "#FFFFFF", color: INK, minHeight: A4_H, padding: pad("54", "58") }}>
      <div style={{ fontSize: 34, fontWeight: 300, letterSpacing: "-0.5px", lineHeight: lh(1.1) }}>
        {p.fullName || "—"}
      </div>
      <div style={{ fontSize: 13, color: MUTED, marginTop: sp(6), letterSpacing: "0.5px" }}>{p.title}</div>
      <div style={{ fontSize: 10.5, color: MUTED, marginTop: sp(10), lineHeight: lh(1.7) }}>
        {contactLine(p, "    ")}
      </div>
      <div style={{ height: 1, background: LINE, margin: `${sp(24)} 0` }} />

      {cv.summary && (
        <p style={{ fontSize: 12, lineHeight: lh(1.8), color: "#334155", margin: `0 0 ${sp(22)}` }}>{cv.summary}</p>
      )}
      {cv.experience.length > 0 && (
        <Section title={d.experience} accent={MUTED} lang={lang}>
          {cv.experience.map((e) => (
            <Entry
              key={e.id}
              accent={MUTED}
              title={e.role}
              sub={e.company}
              meta={dates(e.start, e.end, e.current, d)}
              body={e.description}
            />
          ))}
        </Section>
      )}
      {cv.education.length > 0 && (
        <Section title={d.education} accent={MUTED} lang={lang}>
          {cv.education.map((e) => (
            <Entry
              key={e.id}
              accent={MUTED}
              title={e.degree}
              sub={e.school}
              meta={dates(e.start, e.end, false, d)}
              body={e.details}
            />
          ))}
        </Section>
      )}
      {cv.skills.length > 0 && (
        <Section title={d.skills} accent={MUTED} lang={lang}>
          <div style={{ fontSize: 12, color: "#334155", lineHeight: lh(1.9) }}>
            {cv.skills.map((s) => s.name).join("  ·  ")}
          </div>
        </Section>
      )}
      {cv.languages.length > 0 && (
        <Section title={d.languages} accent={MUTED} lang={lang}>
          <div style={{ fontSize: 12, color: "#334155", lineHeight: lh(1.9) }}>
            {cv.languages.map((l) => `${l.name} (${l.level})`).join("  ·  ")}
          </div>
        </Section>
      )}
      {cv.projects.length > 0 && (
        <Section title={d.projects} accent={MUTED} lang={lang}>
          {cv.projects.map((e) => (
            <Entry key={e.id} accent={MUTED} title={e.name} sub={e.link} meta="" body={e.description} />
          ))}
        </Section>
      )}
      {cv.certifications.length > 0 && (
        <Section title={d.certifications} accent={MUTED} lang={lang}>
          <CertList cv={cv} />
        </Section>
      )}
    </div>
  );
}

/* ------------------------------- Creative ------------------------------ */
function Creative({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ background: "#FFFFFF", color: INK, minHeight: A4_H }}>
      <div
        style={{
          background: "linear-gradient(120deg,#4F46E5 0%,#7C3AED 45%,#10B981 100%)",
          color: "#FFFFFF",
          padding: pad("40", "44"),
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {p.avatar ? (
          <div style={{ padding: 4, borderRadius: 26, background: "rgba(255,255,255,0.25)" }}>
            <Avatar src={p.avatar} size={92} radius={22} />
          </div>
        ) : null}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: lh(1.1), letterSpacing: "-1px" }}>
            {p.fullName || "—"}
          </div>
          <div style={{ fontSize: 14, marginTop: sp(6), color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
            {p.title}
          </div>
          <div style={{ fontSize: 11, marginTop: sp(10), color: "rgba(255,255,255,0.85)", lineHeight: lh(1.6) }}>
            {contactLine(p, "   •   ")}
          </div>
        </div>
      </div>

      <div style={{ padding: pad("28", "44") }}>
        {cv.summary && (
          <div
            style={{
              borderInlineStart: `4px solid ${INDIGO}`,
              paddingInlineStart: sp(14),
              marginBottom: sp(22),
            }}
          >
            <p style={{ fontSize: 12.5, lineHeight: lh(1.75), color: "#334155", margin: 0 }}>{cv.summary}</p>
          </div>
        )}
        {cv.experience.length > 0 && (
          <Section title={d.experience} accent="#7C3AED" lang={lang}>
            {cv.experience.map((e) => (
              <div
                key={e.id}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 14,
                  padding: sp(14),
                  marginBottom: sp(10),
                }}
              >
                <Entry
                  title={e.role}
                  sub={e.company}
                  accent="#7C3AED"
                  meta={dates(e.start, e.end, e.current, d)}
                  body={e.description}
                />
              </div>
            ))}
          </Section>
        )}
        <div style={{ display: "flex", gap: 26 }}>
          {cv.education.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.education} accent="#7C3AED" lang={lang}>
                {cv.education.map((e) => (
                  <Entry
                    key={e.id}
                    accent="#7C3AED"
                    title={e.degree}
                    sub={e.school}
                    meta={dates(e.start, e.end, false, d)}
                    body={e.details}
                  />
                ))}
              </Section>
            </div>
          )}
          {cv.skills.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.skills} accent="#7C3AED" lang={lang}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cv.skills.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        fontSize: 10.5,
                        background: "linear-gradient(135deg,#EEF2FF,#ECFDF5)",
                        color: "#3730A3",
                        borderRadius: 999,
                        padding: "5px 11px",
                        fontWeight: 600,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </Section>
            </div>
          )}
        </div>
        {cv.projects.length > 0 && (
          <Section title={d.projects} accent="#7C3AED" lang={lang}>
            {cv.projects.map((e) => (
              <Entry key={e.id} accent="#7C3AED" title={e.name} sub={e.link} meta="" body={e.description} />
            ))}
          </Section>
        )}
        <div style={{ display: "flex", gap: 26 }}>
          {cv.languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.languages} accent="#7C3AED" lang={lang}>
                {cv.languages.map((l) => (
                  <div key={l.id} style={{ fontSize: 11.5, color: "#334155", marginBottom: sp(4) }}>
                    {l.name} — <span style={{ color: MUTED }}>{l.level}</span>
                  </div>
                ))}
              </Section>
            </div>
          )}
          {cv.certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <Section title={d.certifications} accent="#7C3AED" lang={lang}>
                <CertList cv={cv} />
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Corporate ------------------------------ */
function Corporate({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ background: "#FFFFFF", color: INK, minHeight: A4_H }}>
      <div style={{ height: 10, background: `linear-gradient(90deg,${INDIGO},${EMERALD})` }} />
      <div style={{ padding: pad("34", "48") }}>
        <header style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: lh(1.15) }}>
              {p.fullName || "—"}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: sp(7),
                background: "#EEF2FF",
                color: "#3730A3",
                fontSize: 11.5,
                fontWeight: 700,
                borderRadius: 6,
                padding: "4px 10px",
              }}
            >
              {p.title}
            </div>
          </div>
          <Avatar src={p.avatar} size={74} radius={10} />
        </header>
        <div
          style={{
            marginTop: sp(14),
            padding: `${sp(10)} 0`,
            borderTop: `1px solid ${LINE}`,
            borderBottom: `1px solid ${LINE}`,
            fontSize: 11,
            color: MUTED,
            lineHeight: lh(1.6),
          }}
        >
          {contactLine(p, "   |   ")}
        </div>

        <div style={{ marginTop: sp(20) }}>
          {cv.summary && (
            <Section title={d.profile} accent={INDIGO} lang={lang} rule>
              <p style={{ fontSize: 12, lineHeight: lh(1.7), color: "#334155", margin: 0 }}>{cv.summary}</p>
            </Section>
          )}
          {cv.experience.length > 0 && (
            <Section title={d.experience} accent={INDIGO} lang={lang} rule>
              {cv.experience.map((e) => (
                <Entry
                  key={e.id}
                  title={e.role}
                  sub={e.company}
                  meta={dates(e.start, e.end, e.current, d)}
                  body={e.description}
                />
              ))}
            </Section>
          )}
          {cv.education.length > 0 && (
            <Section title={d.education} accent={INDIGO} lang={lang} rule>
              {cv.education.map((e) => (
                <Entry
                  key={e.id}
                  title={e.degree}
                  sub={e.school}
                  meta={dates(e.start, e.end, false, d)}
                  body={e.details}
                />
              ))}
            </Section>
          )}
          <div style={{ display: "flex", gap: 28 }}>
            {cv.skills.length > 0 && (
              <div style={{ flex: 1 }}>
                <Section title={d.skills} accent={INDIGO} lang={lang} rule>
                  {cv.skills.map((s) => (
                    <div key={s.id} style={{ marginBottom: sp(7) }}>
                      <div style={{ fontSize: 11.5, color: "#334155", marginBottom: sp(3) }}>{s.name}</div>
                      <div style={{ height: 5, background: "#E2E8F0", borderRadius: 4 }}>
                        <div
                          style={{
                            width: `${(s.level / 5) * 100}%`,
                            height: "100%",
                            borderRadius: 4,
                            background: INDIGO,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Section>
              </div>
            )}
            {cv.languages.length > 0 && (
              <div style={{ flex: 1 }}>
                <Section title={d.languages} accent={INDIGO} lang={lang} rule>
                  {cv.languages.map((l) => (
                    <div
                      key={l.id}
                      style={{
                        fontSize: 12,
                        color: "#334155",
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: sp(5),
                      }}
                    >
                      <span>{l.name}</span>
                      <span style={{ color: MUTED }}>{l.level}</span>
                    </div>
                  ))}
                </Section>
              </div>
            )}
          </div>
          {cv.projects.length > 0 && (
            <Section title={d.projects} accent={INDIGO} lang={lang} rule>
              {cv.projects.map((e) => (
                <Entry key={e.id} title={e.name} sub={e.link} meta="" body={e.description} />
              ))}
            </Section>
          )}
          {cv.certifications.length > 0 && (
            <Section title={d.certifications} accent={INDIGO} lang={lang} rule>
              <CertList cv={cv} />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Compact ------------------------------- */
function Compact({ cv, d, lang }: TProps) {
  const p = cv.personal;
  const head = (title: string) => (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        color: EMERALD,
        marginBottom: sp(6),
      }}
    >
      {title}
    </div>
  );
  return (
    <div style={{ background: "#FFFFFF", color: INK, minHeight: A4_H, padding: pad("34", "40") }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: sp(14) }}>
        <Avatar src={p.avatar} size={62} radius={999} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 23, fontWeight: 800, lineHeight: lh(1.15) }}>{p.fullName || "—"}</div>
          <div style={{ fontSize: 11.5, color: EMERALD, fontWeight: 600 }}>{p.title}</div>
        </div>
        <div style={{ fontSize: 10, color: MUTED, textAlign: "end", lineHeight: lh(1.7), maxWidth: 220 }}>
          {[p.email, p.phone, p.location, p.website].filter(Boolean).map((x) => (
            <div key={x}>{x}</div>
          ))}
        </div>
      </header>
      <div style={{ height: 2, background: INK, marginBottom: sp(14) }} />

      {cv.summary && (
        <div style={{ marginBottom: sp(14) }}>
          {head(d.profile)}
          <p style={{ fontSize: 11, lineHeight: lh(1.55), color: "#334155", margin: 0 }}>{cv.summary}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 2 }}>
          {cv.experience.length > 0 && (
            <div style={{ marginBottom: sp(14) }}>
              {head(d.experience)}
              {cv.experience.map((e) => (
                <div key={e.id} style={{ marginBottom: sp(10) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700 }}>{e.role}</span>
                    <span style={{ fontSize: 9.5, color: MUTED, whiteSpace: "nowrap" }}>
                      {dates(e.start, e.end, e.current, d)}
                    </span>
                  </div>
                  <div style={{ fontSize: 10.5, color: INDIGO }}>{e.company}</div>
                  <Body text={e.description} color="#475569" />
                </div>
              ))}
            </div>
          )}
          {cv.projects.length > 0 && (
            <div style={{ marginBottom: sp(14) }}>
              {head(d.projects)}
              {cv.projects.map((e) => (
                <div key={e.id} style={{ marginBottom: sp(7), fontSize: 10.5, color: "#475569", lineHeight: lh(1.55) }}>
                  <strong style={{ color: INK, fontSize: 11 }}>{e.name}</strong>
                  {e.link ? ` — ${e.link}` : ""}
                  {e.description ? <div>{e.description}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {cv.education.length > 0 && (
            <div style={{ marginBottom: sp(14) }}>
              {head(d.education)}
              {cv.education.map((e) => (
                <div key={e.id} style={{ marginBottom: sp(8), fontSize: 10.5, lineHeight: lh(1.5) }}>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{e.degree}</div>
                  <div style={{ color: MUTED }}>{e.school}</div>
                  <div style={{ color: MUTED }}>{dates(e.start, e.end, false, d)}</div>
                </div>
              ))}
            </div>
          )}
          {cv.skills.length > 0 && (
            <div style={{ marginBottom: sp(14) }}>
              {head(d.skills)}
              <div style={{ fontSize: 10.5, color: "#334155", lineHeight: lh(1.8) }}>
                {cv.skills.map((s) => s.name).join(" · ")}
              </div>
            </div>
          )}
          {cv.languages.length > 0 && (
            <div style={{ marginBottom: sp(14) }}>
              {head(d.languages)}
              {cv.languages.map((l) => (
                <div key={l.id} style={{ fontSize: 10.5, color: "#334155", lineHeight: lh(1.7) }}>
                  {l.name} — <span style={{ color: MUTED }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}
          {cv.certifications.length > 0 && (
            <div>
              {head(d.certifications)}
              {cv.certifications.map((c) => (
                <div key={c.id} style={{ fontSize: 10.5, color: "#334155", lineHeight: lh(1.6), marginBottom: sp(4) }}>
                  {[c.name, c.issuer, c.year].filter(Boolean).join(" · ")}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ registry ------------------------------- */
const COMPONENTS: Record<TemplateId, (p: TProps) => React.JSX.Element> = {
  aurora: Modern,
  classic: Executive,
  minimal: Minimal,
  compact: Compact,
  mono: Tech,
  prestige: Elegant,
  creative: Creative,
  corporate: Corporate,
};

export const TEMPLATES: {
  id: TemplateId;
  name: { en: string; ar: string; fr: string };
  premium: boolean;
  swatch: string[];
}[] = [
  {
    id: "aurora",
    name: { en: "Modern", ar: "عصري", fr: "Moderne" },
    premium: false,
    swatch: ["#4F46E5", "#A5B4FC", "#FFFFFF"],
  },
  {
    id: "classic",
    name: { en: "Executive", ar: "تنفيذي", fr: "Exécutif" },
    premium: false,
    swatch: ["#0F172A", "#10B981", "#FFFFFF"],
  },
  {
    id: "minimal",
    name: { en: "Minimal", ar: "بسيط", fr: "Minimal" },
    premium: false,
    swatch: ["#FFFFFF", "#E2E8F0", "#64748B"],
  },
  {
    id: "compact",
    name: { en: "Compact", ar: "مُكثّف", fr: "Compact" },
    premium: false,
    swatch: ["#0F172A", "#10B981", "#F8FAFC"],
  },
  {
    id: "mono",
    name: { en: "Tech", ar: "تِك", fr: "Tech" },
    premium: true,
    swatch: ["#0F172A", "#10B981", "#94A3B8"],
  },
  {
    id: "prestige",
    name: { en: "Elegant", ar: "أنيق", fr: "Élégant" },
    premium: true,
    swatch: ["#F8FAFC", "#4F46E5", "#10B981"],
  },
  {
    id: "creative",
    name: { en: "Creative", ar: "إبداعي", fr: "Créatif" },
    premium: true,
    swatch: ["#7C3AED", "#4F46E5", "#10B981"],
  },
  {
    id: "corporate",
    name: { en: "Corporate", ar: "مؤسسي", fr: "Corporate" },
    premium: true,
    swatch: ["#4F46E5", "#0F172A", "#EEF2FF"],
  },
];

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Measures the rendered CV and grows (or shrinks) spacing + line-height so the
 * content fills the full A4 page height instead of leaving a blank bottom.
 */
function useAutoFill(signature: string) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [fill, setFill] = React.useState(1);
  const [scale, setScale] = React.useState(1);
  const passes = React.useRef(0);

  React.useEffect(() => {
    passes.current = 0;
    setFill(1);
    setScale(1);
  }, [signature]);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || passes.current > 10) return;
    const h = el.scrollHeight;
    if (!h) return;
    const ratio = A4_H / h;
    if (Math.abs(h - A4_H) <= 6) return;
    passes.current += 1;
    const next = Math.min(1.9, Math.max(0.78, fill * ratio));
    if (Math.abs(next - fill) > 0.004) {
      setFill(next);
      if (scale !== 1) setScale(1);
      return;
    }
    // spacing alone can't fit the content: scale the whole page down
    const s = Math.min(1, Math.max(0.6, ratio));
    if (Math.abs(s - scale) > 0.004) setScale(s);
  });

  return { ref, fill, scale };
}

export function CVDocument({ cv, d, lang }: TProps) {
  const Comp = COMPONENTS[cv.template] ?? Modern;
  const signature = React.useMemo(() => JSON.stringify(cv) + lang, [cv, lang]);
  const { ref, fill, scale } = useAutoFill(signature);
  const vars = {
    "--fill": String(Number(fill.toFixed(3))),
    "--lh": String(Number((1 + (fill - 1) * 0.45).toFixed(3))),
  } as React.CSSProperties;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        width: A4_W,
        height: A4_H,
        overflow: "hidden",
        background: "#FFFFFF",
        fontFamily:
          lang === "ar" ? "'Cairo', 'Segoe UI', sans-serif" : "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      }}
    >
      <div
        ref={ref}
        style={{
          ...vars,
          width: A4_W,
          minHeight: A4_H,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: lang === "ar" ? "top right" : "top left",
        }}
      >
        <Comp cv={cv} d={d} lang={lang} />
      </div>
    </div>
  );
}
