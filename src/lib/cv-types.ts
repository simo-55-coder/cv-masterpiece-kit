export type Id = string;

export interface Experience {
  id: Id;
  role: string;
  company: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
}
export interface Education {
  id: Id;
  degree: string;
  school: string;
  start: string;
  end: string;
  details: string;
}
export interface Skill {
  id: Id;
  name: string;
  level: number;
}
export interface Language {
  id: Id;
  name: string;
  level: string;
}
export interface Project {
  id: Id;
  name: string;
  link: string;
  description: string;
}
export interface Certification {
  id: Id;
  name: string;
  issuer: string;
  year: string;
}

export interface CVData {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    avatar: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  certifications: Certification[];
  template: TemplateId;
}

export type TemplateId = "aurora" | "classic" | "mono" | "prestige";

export const PREMIUM_TEMPLATES: TemplateId[] = ["mono", "prestige"];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyCV = (): CVData => ({
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    avatar: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  template: "aurora",
});

export const sampleCV = (): CVData => ({
  personal: {
    fullName: "Amina El Fassi",
    title: "Senior Product Designer",
    email: "amina.elfassi@mail.com",
    phone: "+212 6 55 21 88 04",
    location: "Casablanca, Morocco",
    website: "aminaelfassi.design",
    avatar: "",
  },
  summary:
    "Product designer with 7 years of experience shaping data-heavy SaaS products end to end. I turn ambiguous problems into shipped, measurable interfaces and lead design systems used by cross-functional teams.",
  experience: [
    {
      id: uid(),
      role: "Senior Product Designer",
      company: "Northwind Analytics",
      start: "2022",
      end: "",
      current: true,
      description:
        "Led redesign of the reporting suite, lifting weekly active usage by 34%.\nBuilt and maintained a 120-component design system adopted by 4 squads.",
    },
    {
      id: uid(),
      role: "Product Designer",
      company: "Lumen Studio",
      start: "2019",
      end: "2022",
      current: false,
      description:
        "Shipped 12 client products across fintech and logistics.\nRan discovery interviews and usability testing cycles for every release.",
    },
  ],
  education: [
    {
      id: uid(),
      degree: "MSc Human-Computer Interaction",
      school: "Université Mohammed V",
      start: "2016",
      end: "2018",
      details: "Graduated with distinction.",
    },
  ],
  skills: [
    { id: uid(), name: "Design Systems", level: 5 },
    { id: uid(), name: "User Research", level: 4 },
    { id: uid(), name: "Prototyping", level: 5 },
    { id: uid(), name: "Front-end (React)", level: 3 },
  ],
  languages: [
    { id: uid(), name: "Arabic", level: "Native" },
    { id: uid(), name: "French", level: "Fluent" },
    { id: uid(), name: "English", level: "Professional" },
  ],
  projects: [
    {
      id: uid(),
      name: "Atlas Design Kit",
      link: "github.com/atlas-kit",
      description: "Open-source component kit downloaded 9k+ times.",
    },
  ],
  certifications: [
    { id: uid(), name: "Google UX Professional", issuer: "Google", year: "2021" },
  ],
  template: "aurora",
});
