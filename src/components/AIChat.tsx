"use client";
import { useEffect, useRef, useState } from "react";

interface Msg {
  from: "user" | "bot";
  text: string;
}

type Mode = "mohit" | "general";

const SUGGESTIONS: Record<Mode, string[]> = {
  mohit: ["Who is Mohit?", "What has he built?", "What skills does he have?", "Tell me about his AI work."],
  general: ["Explain RAG simply", "Write a haiku about code", "React vs Next.js?"],
};

const PLACEHOLDER: Record<Mode, string> = {
  mohit: "Ask about projects, skills, work…",
  general: "Ask anything…",
};

const OFFLINE_MSG =
  "Mohit AI is offline right now — the agent backend isn't reachable. Try again in a bit, or reach Mohit directly at mohitsahu60067@gmail.com.";

const AGENT_URL = (
  process.env.NEXT_PUBLIC_AGENT_URL || "https://portfolio-ah18.onrender.com"
).replace(/\/$/, "");

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [engine, setEngine] = useState<string>("unknown");
  const [llmReady, setLlmReady] = useState(false);
  const [mode, setMode] = useState<Mode>("mohit");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Ask me anything about my work." },
  ]);
  const boxRef = useRef<HTMLDivElement>(null);
  const streamAbort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch(`${AGENT_URL}/health`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setOnline(d.status === "ok");
          setEngine(d.engine ?? "unknown");
          setLlmReady(d.engine === "adk-gemini");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOnline(false);
          setEngine("offline");
          setLlmReady(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open ]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs, busy, open]);

  useEffect(() => {
    // Stop an in-flight stream if the panel is closed mid-answer.
    if (!open) streamAbort.current?.abort();
  }, [open]);

  const appendToLast = (chunk: string) => {
    setMsgs((m) => {
      const copy = [...m];
      copy[copy.length - 1] = { from: "bot", text: copy[copy.length - 1].text + chunk };
      return copy;
    });
  };

  const sendPlain = async (text: string, useMode: Mode): Promise<boolean> => {
    try {
      const res = await fetch(`${AGENT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode: useMode }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { from: "bot", text: data.response ?? "No response from the agent." }]);
      if (data.engine) setEngine(data.engine);
      setOnline(res.ok);
      return res.ok;
    } catch {
      return false;
    }
  };

  const sendStream = async (text: string, useMode: Mode): Promise<boolean> => {
    const ctrl = new AbortController();
    streamAbort.current = ctrl;
    let res: Response;
    try {
      res = await fetch(`${AGENT_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode: useMode }),
        signal: ctrl.signal,
      });
    } catch {
      return false;
    }
    if (!res.ok || !res.body) return false;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let gotToken = false;
    setMsgs((m) => [...m, { from: "bot", text: "" }]);
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          try {
            const ev = JSON.parse(line.slice(5));
            if (ev.t === "tok" && typeof ev.text === "string") {
              gotToken = true;
              appendToLast(ev.text);
            } else if (ev.t === "meta" && ev.engine) {
              setEngine(ev.engine);
            } else if (ev.t === "done") {
              if (ev.engine) setEngine(ev.engine);
              setOnline(ev.engine !== "offline" && ev.engine !== "error");
            }
          } catch {
            /* ignore malformed chunk */
          }
        }
      }
    } catch {
      return gotToken;
    } finally {
      reader.releaseLock();
      if (streamAbort.current === ctrl) streamAbort.current = null;
    }
    return gotToken;
  };

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const useMode = mode;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setBusy(true);
    const streamed = await sendStream(text, useMode);
    if (!streamed) {
      // Streaming failed before any token — fall back to a single response.
      setMsgs((m) => m.filter((msg, i) => !(msg.from === "bot" && msg.text === "" && i === m.length - 1)));
      const ok = await sendPlain(text, useMode);
      if (!ok) {
        setOnline(false);
        setMsgs((m) => [...m, { from: "bot", text: OFFLINE_MSG }]);
      }
    }
    setBusy(false);
  };

  const switchMode = (next: Mode) => {
    if (next === mode || busy) return;
    setMode(next);
    setMsgs((m) => [
      ...m,
      {
        from: "bot",
        text:
          next === "general"
            ? llmReady
              ? "General mode on — ask me anything."
              : "General mode needs a Gemini API key (add GOOGLE_API_KEY to ai-agent/.env). Until then, Mohit mode works fully."
            : "Mohit mode on — ask me about his work, projects, and skills.",
      },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close Mohit AI chat" : "Open Mohit AI chat"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full pl-4 pr-5 py-3 bg-[var(--ink)] text-[var(--bg)] text-sm font-semibold shadow-[0_10px_36px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-transform"
      >
        <span
          className={`w-2 h-2 rounded-full ${online === false ? "bg-red-500" : online ? "bg-emerald-500" : "bg-[var(--accent)] animate-pulse"}`}
          aria-hidden
        />
        MOHIT AI
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Mohit AI assistant"
          className="fixed bottom-20 right-5 z-[70] w-[min(92vw,380px)] rounded-2xl border border-[var(--line)] bg-[var(--panel)] overflow-hidden shadow-2xl"
        >
          <div className="px-5 py-4 border-b border-[var(--line)]">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm tracking-tight">MOHIT AI</p>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-xl leading-none px-2 text-[var(--mute)] hover:text-[var(--ink)]">
                ×
              </button>
            </div>
            <p className="mono text-[10px] tracking-[0.14em] text-[var(--faint)] mt-1">ASK ME ABOUT MOHIT — OR ANYTHING</p>
            <div className="mt-2.5 grid grid-cols-2 gap-1 p-1 rounded-full border border-[var(--line)]" role="group" aria-label="Chat mode">
              {(["mohit", "general"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  aria-pressed={mode === m}
                  disabled={busy}
                  className={`mono text-[11px] py-1.5 rounded-full transition-colors disabled:opacity-50 ${
                    mode === m ? "bg-[var(--ink)] text-[var(--bg)] font-semibold" : "text-[var(--mute)]"
                  }`}
                >
                  {m === "mohit" ? "Mohit" : "General"}
                </button>
              ))}
            </div>
            <p className="mono text-[10px] tracking-[0.14em] text-[var(--faint)] mt-2 flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${online === false ? "bg-red-500" : online ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} aria-hidden />
              {online === false
                ? "OFFLINE — BACKEND UNREACHABLE"
                : online
                  ? `ONLINE · ${engine === "adk-gemini" ? "ADK + GEMINI" : engine === "adk-general" ? "GENERAL · GEMINI" : engine === "needs-key" ? "GENERAL NEEDS KEY" : "PYTHON AGENT"}`
                  : "CONNECTING…"}
            </p>
          </div>

          <div ref={boxRef} className="h-72 overflow-y-auto px-4 py-4 flex flex-col gap-2.5" aria-live="polite">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`text-[13px] leading-relaxed rounded-xl px-3.5 py-2.5 max-w-[92%] whitespace-pre-line ${
                  m.from === "user"
                    ? "self-end bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] border border-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
                    : "self-start bg-[var(--wash)] border border-[var(--line)] text-[var(--body)]"
                }`}
              >
                {m.text}
              </p>
            ))}
            {busy && (
              <p className="self-start mono text-xs text-[var(--faint)] px-1" aria-label="Agent is typing">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>·</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>·</span>
                </span>
              </p>
            )}
          </div>

          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS[mode].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={busy}
                className="mono text-[10px] px-2.5 py-1.5 rounded-full border border-[var(--line)] text-[var(--mute)] hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-[var(--ink)] disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>

          <form className="p-3 border-t border-[var(--line)] flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <label htmlFor="ai-input" className="sr-only">Ask Mohit AI</label>
            <input
              id="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDER[mode]}
              autoComplete="off"
              className="flex-1 bg-[var(--wash)] border border-[var(--line)] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[color-mix(in_srgb,var(--accent)_60%,transparent)] placeholder:text-[var(--faint)]"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send message" className="btn-primary w-10 h-10 grid place-items-center shrink-0 disabled:opacity-40">
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}
