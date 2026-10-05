import { SectionHeading } from "./ui";

const flow = ["User", "AI agent", "Thinking", "Tools", "Data", "Answer"];
const notes: Record<string, string> = {
  User: "you ask a question",
  "AI agent": "Mohit AI — Python + Google ADK",
  Thinking: "the model picks which tools to use",
  Tools: "get_projects · get_skills · get_leetcode …",
  Data: "my real profile, projects, and skills",
  Answer: "a short answer with real facts",
};

const chips = ["Python", "LLMs", "RAG", "AI Agents", "Google ADK"];

export default function AIEngineering() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16 border-t rule" aria-label="AI">
      <SectionHeading index="04" label="AI" title="AI" sub="I also build AI apps using Python, LLMs, RAG, and AI agents." />
      <div data-reveal className="flex flex-wrap gap-2 mb-10">
        {chips.map((c) => (
          <span key={c} className="text-sm px-4 py-2 rounded-full border rule bg-[var(--wash)]">{c}</span>
        ))}
      </div>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <p id="ai-flow" data-reveal className="mono text-[11px] tracking-[0.18em] text-[var(--faint)] mb-2">HOW THE CHAT BELOW WORKS</p>
          <ol className="flex flex-col" aria-labelledby="ai-flow">
            {flow.map((n, i) => (
              <li key={n} data-reveal>
                <div className="flex items-baseline gap-4 py-2.5 border-t rule">
                  <span className="mono text-[11px] text-[var(--accent)]">0{i + 1}</span>
                  <div>
                    <p className="font-bold text-[17px] leading-tight">{n}</p>
                    <p className="mono text-[11px] text-[var(--faint)] mt-0.5">{notes[n]}</p>
                  </div>
                </div>
                {i === flow.length - 1 && <span className="block border-t rule" aria-hidden />}
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p data-reveal className="text-[15px] text-[var(--body)] leading-relaxed">
            I build AI agents that can use tools and get things done. The chat on this
            page is one of them — it reads my real data files and only answers from
            what it can verify.
          </p>
        </div>
      </div>
    </section>
  );
}
