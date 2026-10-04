import { NextResponse } from "next/server";

const AGENT_URL =
  process.env.AGENT_URL || process.env.NEXT_PUBLIC_AGENT_URL || "http://127.0.0.1:8001";

async function agentFetch(path: string, init?: RequestInit, timeoutMs = 45000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${AGENT_URL}${path}`, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

/** GET /api/chat → backend status (drives the Online/Offline dot). */
export async function GET() {
  try {
    const res = await agentFetch("/health", undefined, 5000);
    if (!res.ok) throw new Error(`agent health ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ online: true, engine: data.engine ?? "unknown" });
  } catch {
    return NextResponse.json({ online: false, engine: "offline" });
  }
}

/** POST /api/chat { message, mode } → { response, engine } via the Python ADK agent. */
export async function POST(req: Request) {
  let message = "";
  let mode = "mohit";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim().slice(0, 2000) : "";
    if (body?.mode === "general") mode = "general";
  } catch {
    return NextResponse.json({ response: "Send a message and I'll answer from Mohit's verified profile." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ response: mode === "general" ? "Ask me anything." : "Ask me something about Mohit — his work, projects, skills, or background." });
  }
  try {
    const res = await agentFetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, mode }),
    });
    if (!res.ok) throw new Error(`agent chat ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ response: data.response, engine: data.engine ?? "unknown" });
  } catch {
    return NextResponse.json(
      {
        response:
          "Mohit AI is offline right now — the agent backend isn't reachable. Try again in a bit, or reach Mohit directly at mohitsahu60067@gmail.com.",
        engine: "offline",
      },
      { status: 503 }
    );
  }
}
