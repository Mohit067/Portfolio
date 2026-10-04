export interface Experience {
  period: string;
  role: string;
  org: string;
  location?: string;
  points: string[];
  tech: string[];
  current?: boolean;
}

export const experience: Experience[] = [
  {
    period: "Sep 2026 — Present",
    role: "Associate Software Engineer",
    org: "Maventic Innovation Pvt. Ltd.",
    location: "Bhopal, Madhya Pradesh, India",
    points: [
      "I work on AI systems — LLMs, RAG, and AI agents.",
      "I help put LLM features into real products.",
    ],
    tech: ["Agentic AI", "LLM", "RAG", "Python"],
    current: true,
  },
  {
    period: "Completed",
    role: "B.Tech, Artificial Intelligence and Data Science",
    org: "Samrat Ashok Technological Institute, Vidisha",
    points: [
      "I learned coding, DSA, and OOP in C++.",
      "Class XII (MP Board): 92% — Govt. Boy's Higher Secondary School, Khargapur.",
    ],
    tech: ["C++", "DSA", "OOP", "Python"],
  },
];

export interface SkillGroup {
  title: string;
  note?: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  { title: "Frontend", items: ["HTML", "CSS", "JavaScript", "React", "Next.js"] },
  { title: "Backend", items: ["Node.js", "Express", "REST API"] },
  { title: "AI", items: ["Python", "LLM", "RAG", "AI Agents", "Google ADK"] },
  { title: "Database", items: ["MongoDB", "SQL"] },
  { title: "Other", items: ["C++", "TypeScript", "Git", "Docker", "WebSockets"] },
];
