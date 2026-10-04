# Mohit Sahu — Portfolio + Mohit AI agent

Personal portfolio of **Mohit Sahu, Associate Software Engineer at Maventic Innovation Pvt. Ltd.**
Full-stack products, realtime backends, and LLM / RAG / agentic AI systems — plus **Mohit AI**,
a real Python + Google ADK agent answering questions from verified profile data.

```
portfolio/
├── src/                    # Next.js 16 frontend (React 19, TS, Tailwind v4, GSAP)
│   ├── app/
│   │   ├── api/chat/       # POST/GET → proxies to the Python agent (never exposes keys)
│   │   ├── layout.tsx      # SEO, OG, Person JSON-LD
│   │   └── page.tsx
│   ├── components/         # Navbar, Hero, Statement, Experience, Projects, …
│   └── data/               # profile.ts, projects.ts, experience.ts (frontend mirror)
├── ai-agent/               # Python backend — Google ADK agent
│   ├── agent.py            # LlmAgent + 7 tools + deterministic retrieval fallback
│   ├── server.py           # FastAPI: POST /chat, GET /health
│   ├── tools/mohit_tools.py
│   ├── data/*.json         # profile, projects, experience, skills (source of truth)
│   ├── prompts/system.md   # personality + anti-hallucination rules
│   └── requirements.txt
└── public/mohit.png        # real portrait
```

## Architecture

```
visitor ──▶ Next.js UI ──▶ /api/chat/stream (SSE) ──▶ FastAPI :8001 ──▶ ADK agent
                                                                    │
                                    ┌───────────────┬───────────────┘
                              Mohit mode        General mode
                          tools + data/*.json   Gemini answers anything
```

The chat has two modes, toggled in the panel header. The API forwards `{ message, mode }`
and streams SSE events (`meta` / `tok` / `done`); `engine` is `"adk-gemini"`, `"adk-general"`,
`"retrieval"`, or `"needs-key"`. Without `GOOGLE_API_KEY`, Mohit mode answers from verified
data and General mode explains how to enable it. No API keys ever reach the browser.

## Run it

**1. Agent backend**
```bash
cd ai-agent
python -m pip install -r requirements.txt
copy .env.example .env        # then set GOOGLE_API_KEY (optional but recommended)
python -m uvicorn server:app --port 8001
```

**2. Frontend**
```bash
pnpm install
pnpm dev                      # http://localhost:3000
```

Optional env for the frontend: `AGENT_URL=http://127.0.0.1:8001` (default already points there).
 
**3. Or run everything via Docker (Both Frontend + AI Agent)**
```bash
docker compose up --build -d
# Or: pnpm docker:up
```
Stop containers:
```bash
docker compose down
# Or: pnpm docker:down
```
## Google ADK notes

- Agent: `LlmAgent(name="mohit_ai", model=AGENT_MODEL, instruction=prompts/system.md, tools=[…])`
- 7 function tools: get_profile, get_experience, get_projects, get_project_details,
  get_skills, get_leetcode, get_github_projects — all read `ai-agent/data/*.json`.
- Without `GOOGLE_API_KEY`, the same tools answer deterministically (routing picks
  tools, prose is composed from tool output). Set the key to enable full LLM reasoning.
- Health: `GET http://127.0.0.1:8001/health` → `{ status, engine, llm_configured }`.

## Deploy

- Frontend: Vercel (`pnpm build` is clean). Set `AGENT_URL` to the deployed agent.
- Agent: any Python host (Render/Fly/VM): `uvicorn server:app --host 0.0.0.0 --port $PORT`
  with `GOOGLE_API_KEY` in the host's secret store. Never commit `.env`.
