export function SectionHeading({ label, title, sub }: { index?: string; label: string; title: string; sub?: string }) {
  return (
    <div data-reveal className="mb-8 md:mb-10">
      <p className="label mb-3">— {label}</p>
      <h2 className="display text-3xl md:text-[2.6rem] font-bold leading-[1.05]">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-[var(--mute)] leading-relaxed">{sub}</p>}
    </div>
  );
}
