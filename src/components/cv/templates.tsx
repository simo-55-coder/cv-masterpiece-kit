import type { CVData, TemplateId } from "@/lib/cv-types";
import type { Dict, Lang } from "@/lib/i18n";

export const A4_W = 794;
export const A4_H = 1123;

const INK = "#0F172A";
const MUTED = "#64748B";
const INDIGO = "#4F46E5";
const EMERALD = "#10B981";
const LINE = "#E2E8F0";

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

function Avatar({ src, size, radius }: { src: string; size: number; radius: number }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

/* ------------------------------- Aurora -------------------------------- */
function Aurora({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ display: "flex", height: "100%", background: "#FFFFFF", color: INK }}>
      <aside
        style={{
          width: 268,
          background: "linear-gradient(180deg,#4F46E5 0%,#3730A3 100%)",
          color: "#EEF2FF",
          padding: "36px 26px",
        }}
      >
        {p.avatar ? (
          <div style={{ marginBottom: 20 }}>
            <Avatar src={p.avatar} size={92} radius={999} />
          </div>
        ) : null}
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15, color: "#FFFFFF" }}>
          {p.fullName || "—"}
        </div>
        <div style={{ fontSize: 13, marginTop: 6, color: "#C7D2FE" }}>{p.title}</div>

        <Block title={d.contact} light>
          {[p.email, p.phone, p.location, p.website].filter(Boolean).map((x) => (
            <div key={x} style={{ fontSize: 11.5, marginBottom: 6, wordBreak: "break-word" }}>
              {x}
            </div>
          ))}
        </Block>

        {cv.skills.length > 0 && (
          <Block title={d.skills} light>
            {cv.skills.map((s) => (
              <div key={s.id} style={{ marginBottom: 9 }}>
                <div style={{ fontSize: 11.5, marginBottom: 4 }}>{s.name}</div>
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
                style={{ fontSize: 11.5, display: "flex", justifyContent: "space-between", marginBottom: 5 }}
              >
                <span>{l.name}</span>
                <span style={{ color: "#C7D2FE" }}>{l.level}</span>
              </div>
            ))}
          </Block>
        )}
      </aside>

      <main style={{ flex: 1, padding: "38px 34px" }}>
        {cv.summary && (
          <Section title={d.profile} accent={INDIGO} lang={lang}>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: "#334155", margin: 0 }}>{cv.summary}</p>
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
        {cv.projects.length > 0 && (
          <Section title={d.projects} accent={INDIGO} lang={lang}>
            {cv.projects.map((e) => (
              <Entry key={e.id} title={e.name} sub={e.link} meta="" body={e.description} />
            ))}
          </Section>
        )}
        {cv.certifications.length > 0 && (
          <Section title={d.certifications} accent={INDIGO} lang={lang}>
            {cv.certifications.map((c) => (
              <div key={c.id} style={{ fontSize: 12, marginBottom: 5, color: "#334155" }}>
                <strong style={{ color: INK }}>{c.name}</strong>
                {c.issuer ? ` · ${c.issuer}` : ""}
                {c.year ? ` · ${c.year}` : ""}
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

/* ------------------------------- Classic ------------------------------- */
function Classic({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ background: "#FFFFFF", color: INK, padding: "44px 48px", height: "100%" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          borderBottom: `3px solid ${INK}`,
          paddingBottom: 18,
        }}
      >
        <Avatar src={p.avatar} size={78} radius={8} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.5px" }}>
            {p.fullName || "—"}
          </div>
          <div style={{ fontSize: 13, color: EMERALD, fontWeight: 600, marginTop: 4 }}>{p.title}</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 8 }}>
            {[p.email, p.phone, p.location, p.website].filter(Boolean).join("  ·  ")}
          </div>
        </div>
      </header>

      <div style={{ marginTop: 22 }}>
        {cv.summary && (
          <Section title={d.profile} accent={INK} lang={lang}>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#334155", margin: 0 }}>{cv.summary}</p>
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
                  <div key={s.id} style={{ fontSize: 12, color: "#334155", marginBottom: 4 }}>
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
                  <div key={l.id} style={{ fontSize: 12, color: "#334155", marginBottom: 4 }}>
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
            {cv.certifications.map((c) => (
              <div key={c.id} style={{ fontSize: 12, marginBottom: 4, color: "#334155" }}>
                {[c.name, c.issuer, c.year].filter(Boolean).join(" · ")}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Mono -------------------------------- */
function Mono({ cv, d, lang }: TProps) {
  const p = cv.personal;
  const label = (s: string) => (
    <div
      style={{
        fontSize: 9.5,
        letterSpacing: "1.6px",
        textTransform: "uppercase",
        color: MUTED,
        marginBottom: 8,
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
        height: "100%",
        padding: "44px 46px",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar src={p.avatar} size={72} radius={6} />
        <div>
          <div style={{ fontSize: 27, fontWeight: 700, color: "#FFFFFF" }}>{p.fullName || "—"}</div>
          <div style={{ fontSize: 12, color: EMERALD, marginTop: 5 }}>{p.title}</div>
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 16, lineHeight: 1.8 }}>
        {[p.email, p.phone, p.location, p.website].filter(Boolean).join("   /   ")}
      </div>
      <div style={{ height: 1, background: "#1E293B", margin: "22px 0" }} />

      {cv.summary && (
        <div style={{ marginBottom: 22 }}>
          {label(d.profile)}
          <p style={{ fontSize: 11.5, lineHeight: 1.75, color: "#CBD5E1", margin: 0 }}>{cv.summary}</p>
        </div>
      )}
      {cv.experience.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          {label(d.experience)}
          {cv.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 12.5, color: "#FFFFFF", fontWeight: 600 }}>{e.role}</span>
                <span style={{ fontSize: 10.5, color: EMERALD }}>
                  {dates(e.start, e.end, e.current, d)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{e.company}</div>
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
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11.5, color: "#FFFFFF" }}>{e.degree}</div>
                <div style={{ fontSize: 10.5, color: "#94A3B8" }}>
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
        <div style={{ marginTop: 22 }}>
          {cv.projects.length > 0 && (
            <>
              {label(d.projects)}
              {cv.projects.map((e) => (
                <div key={e.id} style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, color: "#FFFFFF" }}>{e.name}</span>
                  <span style={{ fontSize: 10.5, color: "#94A3B8" }}>
                    {e.link ? ` — ${e.link}` : ""}
                  </span>
                  <div style={{ fontSize: 10.5, color: "#CBD5E1" }}>{e.description}</div>
                </div>
              ))}
            </>
          )}
          {cv.languages.length > 0 && (
            <div style={{ marginTop: 14 }}>
              {label(d.languages)}
              <div style={{ fontSize: 11, color: "#CBD5E1" }}>
                {cv.languages.map((l) => `${l.name} (${l.level})`).join("  ·  ")}
              </div>
            </div>
          )}
          {cv.certifications.length > 0 && (
            <div style={{ marginTop: 14 }}>
              {label(d.certifications)}
              <div style={{ fontSize: 11, color: "#CBD5E1" }}>
                {cv.certifications
                  .map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(" ")) 
                  .join("  ·  ")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Prestige ------------------------------- */
function Prestige({ cv, d, lang }: TProps) {
  const p = cv.personal;
  return (
    <div style={{ background: "#FFFFFF", height: "100%", color: INK }}>
      <div
        style={{
          background: "#F8FAFC",
          borderBottom: `1px solid ${LINE}`,
          padding: "40px 48px 30px",
          textAlign: "center",
        }}
      >
        {p.avatar ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{ padding: 3, borderRadius: 999, background: `linear-gradient(135deg,${INDIGO},${EMERALD})` }}>
              <Avatar src={p.avatar} size={86} radius={999} />
            </div>
          </div>
        ) : null}
        <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: "2px", textTransform: "uppercase" }}>
          {p.fullName || "—"}
        </div>
        <div
          style={{
            width: 46,
            height: 2,
            background: EMERALD,
            margin: "12px auto",
          }}
        />
        <div style={{ fontSize: 12.5, color: INDIGO, letterSpacing: "1px", fontWeight: 600 }}>
          {p.title}
        </div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 10 }}>
          {[p.email, p.phone, p.location, p.website].filter(Boolean).join("   •   ")}
        </div>
      </div>

      <div style={{ padding: "28px 48px" }}>
        {cv.summary && (
          <p
            style={{
              fontSize: 12.5,
              lineHeight: 1.8,
              color: "#334155",
              textAlign: "center",
              margin: "0 0 24px",
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
                  <div key={l.id} style={{ fontSize: 11.5, color: "#334155", marginBottom: 4 }}>
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
            {cv.certifications.map((c) => (
              <div key={c.id} style={{ fontSize: 11.5, marginBottom: 4, color: "#334155" }}>
                {[c.name, c.issuer, c.year].filter(Boolean).join(" · ")}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- shared bits ----------------------------- */
function Block({ title, children, light }: { title: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ marginTop: 26 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color: light ? "#A5B4FC" : MUTED,
          marginBottom: 10,
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
}: {
  title: string;
  children: React.ReactNode;
  accent: string;
  lang: Lang;
  centered?: boolean;
}) {
  return (
    <section style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 10,
          textAlign: centered ? "center" : undefined,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function Body({ text, color, dir }: { text: string; color: string; dir: string }) {
  if (!text) return null;
  return (
    <div style={{ marginTop: 5 }} dir={dir}>
      {text.split("\n").filter(Boolean).map((line, i) => (
        <div key={i} style={{ fontSize: 11.5, lineHeight: 1.6, color, marginBottom: 3 }}>
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
}: {
  title: string;
  sub: string;
  meta: string;
  body: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{title}</span>
        {meta ? <span style={{ fontSize: 10.5, color: MUTED, whiteSpace: "nowrap" }}>{meta}</span> : null}
      </div>
      {sub ? <div style={{ fontSize: 11.5, color: INDIGO, marginTop: 2 }}>{sub}</div> : null}
      <Body text={body} color="#475569" dir="auto" />
    </div>
  );
}

export const TEMPLATES: {
  id: TemplateId;
  name: { en: string; ar: string };
  premium: boolean;
  swatch: string[];
}[] = [
  { id: "aurora", name: { en: "Aurora", ar: "أورورا" }, premium: false, swatch: ["#4F46E5", "#A5B4FC", "#FFFFFF"] },
  { id: "classic", name: { en: "Classic", ar: "كلاسيك" }, premium: false, swatch: ["#0F172A", "#10B981", "#FFFFFF"] },
  { id: "mono", name: { en: "Mono", ar: "مونو" }, premium: true, swatch: ["#0F172A", "#10B981", "#94A3B8"] },
  { id: "prestige", name: { en: "Prestige", ar: "بريستيج" }, premium: true, swatch: ["#F8FAFC", "#4F46E5", "#10B981"] },
];

export function CVDocument({ cv, d, lang }: TProps) {
  const Comp =
    cv.template === "classic"
      ? Classic
      : cv.template === "mono"
        ? Mono
        : cv.template === "prestige"
          ? Prestige
          : Aurora;
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        width: A4_W,
        height: A4_H,
        overflow: "hidden",
        fontFamily:
          lang === "ar"
            ? "'Cairo', 'Segoe UI', sans-serif"
            : "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      }}
    >
      <Comp cv={cv} d={d} lang={lang} />
    </div>
  );
}
