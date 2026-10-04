/** POST /api/chat/stream { message, mode } → proxied SSE from the Python agent. */
export async function POST(req: Request) {
  const AGENT_URL =
    process.env.AGENT_URL || process.env.NEXT_PUBLIC_AGENT_URL || "http://127.0.0.1:8001";

  let message = "";
  let mode = "mohit";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim().slice(0, 2000) : "";
    if (body?.mode === "general") mode = "general";
  } catch {
    return new Response("data: {\"t\": \"done\", \"engine\": \"error\"}\n\n", {
      status: 400,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 150000);
  try {
    const res = await fetch(`${AGENT_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, mode }),
      signal: ctrl.signal,
    });
    if (!res.ok || !res.body) throw new Error(`agent stream ${res.status}`);
    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    const msg =
      "Mohit AI is offline right now — the agent backend isn't reachable. Try again in a bit, or reach Mohit directly at mohitsahu60067@gmail.com.";
    return new Response(`data: {"t": "tok", "text": ${JSON.stringify(msg)}}\n\ndata: {"t": "done", "engine": "offline"}\n\n`, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
