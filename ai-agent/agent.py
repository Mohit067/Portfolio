"""Mohit AI — Google ADK agent + deterministic retrieval fallback.

Primary path (GOOGLE_API_KEY set): a real ADK LlmAgent (Gemini) calls the
tool functions in tools/mohit_tools.py and reasons over verified data.

Fallback path (no key): the same tool functions are selected by a small
router and the answer is composed *from tool output only*. No profile content
is hardcoded in the fallback — every fact comes from ai-agent/data/*.json.
The response always reports which engine produced it.
"""
from __future__ import annotations

import asyncio
import os
import re
import uuid
from pathlib import Path
from typing import Any

from tools.mohit_tools import (
    get_experience,
    get_github_projects,
    get_leetcode,
    get_profile,
    get_project_details,
    get_projects,
    get_skills,
)

try:  # so GOOGLE_API_KEY / AGENT_MODEL also load from ai-agent/.env
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).resolve().parent / ".env")
except ImportError:
    pass

NEEDS_KEY_MSG = (
    "General chat needs a Gemini API key to answer anything. "
    "Add GOOGLE_API_KEY to ai-agent/.env and restart the agent — "
    "Mohit mode works without it."
)

PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"


def load_instruction() -> str:
    return (PROMPTS_DIR / "system.md").read_text(encoding="utf-8")


def has_llm_key() -> bool:
    return bool(os.environ.get("GOOGLE_API_KEY", "").strip())


def build_agent():
    """Construct the real Google ADK agent (lazy import so the module loads
    even where google-adk is not installed)."""
    from google.adk.agents import LlmAgent
    from google.adk.tools import FunctionTool

    return LlmAgent(
        name="mohit_ai",
        model=os.environ.get("AGENT_MODEL", "gemini-2.0-flash"),
        instruction=load_instruction(),
        description="Personal portfolio assistant for Mohit Sahu. Answers only from verified profile tools.",
        tools=[
            FunctionTool(get_profile),
            FunctionTool(get_experience),
            FunctionTool(get_projects),
            FunctionTool(get_project_details),
            FunctionTool(get_skills),
            FunctionTool(get_leetcode),
            FunctionTool(get_github_projects),
        ],
    )


def load_general_instruction() -> str:
    return (PROMPTS_DIR / "general.md").read_text(encoding="utf-8")


def build_general_agent():
    """General-purpose ADK agent (no profile tools): answers anything."""
    from google.adk.agents import LlmAgent

    return LlmAgent(
        name="general_assistant",
        model=os.environ.get("AGENT_MODEL", "gemini-2.0-flash"),
        instruction=load_general_instruction(),
        description="General helpful assistant for any question.",
    )


async def _run_adk(message: str) -> tuple[str, list[str]]:
    """Run one turn through the ADK Runner. Returns (text, tools_used)."""
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.genai import types

    agent = build_agent()
    session_service = InMemorySessionService()
    runner = Runner(
        app_name="mohit_portfolio",
        agent=agent,
        session_service=session_service,
        auto_create_session=True,
    )
    user_id, session_id = "web", f"web-{uuid.uuid4().hex[:8]}"
    chunks: list[str] = []
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=types.Content(role="user", parts=[types.Part(text=message)]),
    ):
        content = getattr(event, "content", None)
        if content and getattr(content, "parts", None):
            for part in content.parts:
                if getattr(part, "text", None):
                    chunks.append(part.text)
    text = "".join(chunks).strip()
    if not text:
        raise RuntimeError("ADK agent returned an empty response")
    return text, ["adk:llm+tools"]


# ---------------------------------------------------------------------------
# Deterministic retrieval fallback (no API key). Routing picks TOOLS, and every
# sentence is formatted from tool output — no hardcoded profile facts.
# ---------------------------------------------------------------------------

def _route(message: str) -> list[str]:
    s = message.lower()
    picks: list[str] = []
    if re.search(r"codenest|idx|cloud ide|code editor|container|docker", s):
        picks.append("codenest")
    if re.search(r"slack|team chat|chat|socket|real-?time|realtime|video.?call|webrtc", s):
        picks += (["teamchat"] if "video" not in s else ["videocall"])
    if re.search(r"document|upload|notif|deadline|mailer|cron", s):
        picks.append("docflow")
    if re.search(r"posture", s):
        picks.append("posture")
    if re.search(r"cli.?agent|terminal agent", s):
        picks.append("cliagent")
    if re.search(r"\bai\b|agent|mcp|llm|rag|adk|langchain|gpt|gemini|genai|artificial intelligence", s):
        picks.append("ai")
    if re.search(r"skill|tech|stack|language|know|framework|tool", s):
        picks.append("skills")
    if re.search(r"leetc|dsa|problem|solv|hackerrank|codechef", s):
        picks.append("leetcode")
    if re.search(r"stud|college|educat|sati|degree|b\.?tech|school", s):
        picks.append("education")
    if re.search(r"work|job|maventic|experience|role|employ|career", s):
        picks.append("experience")
    if re.search(r"contact|email|hire|reach|connect|phone", s):
        picks.append("contact")
    if re.search(r"github|repo", s):
        picks.append("github")
    if re.search(r"project|built|build|portfolio|work", s):
        picks.append("projects")
    if re.search(r"\bwho\b|about|mohit|himself|introduce", s):
        picks.append("who")
    if not picks:
        picks.append("who")
    # "who" is the generic fallback — any specific route suppresses it.
    if len(picks) > 1 and "who" in picks:
        picks.remove("who")
    # de-dupe, keep order
    seen, ordered = set(), []
    for p in picks:
        if p not in seen:
            seen.add(p)
            ordered.append(p)
    return ordered[:3]


def _fmt_who(p: dict) -> str:
    edu = p["education"]
    return (
        f"Yeah \u2014 Mohit Sahu is an {p['title']} at {p['company']} ({p['company_location']}). "
        f"He finished his {edu['degree']} at {edu['institute']}. "
        "He builds web apps, backend systems, and AI tools."
    )


def _fmt_projects(data: dict) -> str:
    lines = ["Here's the lineup — all on his GitHub:"]
    for pr in data["projects"]:
        lines.append(f"• {pr['title']} ({pr['kind']}): {pr['one_liner']}")
    lines.append(f"Plus an AI lab with {len(data['ai_lab'])} experiments. More: {data['more_on_github']}")
    return "\n".join(lines)


def _fmt_project_detail(p: dict) -> str:
    if "error" in p:
        return "I don't have verified information about that project."
    tech = ", ".join(p["tech"])
    feats = "; ".join(p["highlights"])
    link = next(iter(p.get("links", {}).values()), "")
    out = f"{p['title']} — {p['one_liner']} Problem it solves: {p['problem']} Approach: {p['approach']} Stack: {tech}. Highlights: {feats}."
    if p.get("note"):
        out += f" Note: {p['note']}"
    if link:
        out += f" Link: {link}"
    return out


def _fmt_ai(projects_data: dict, profile: dict) -> str:
    lab = "; ".join(f"{r['name']} ({r['what']})" for r in projects_data["ai_lab"])
    return (
        "He builds AI apps with Python, LLMs, RAG, and AI agents \u2014 including work with Google ADK. "
        f"His lab repos: {lab}. At {profile['company']}, he works on LLMs, RAG, and agents."
    )


def _fmt_skills(s: dict) -> str:
    parts = [f"{g['title']}: {', '.join(g['items'])}" for g in s["groups"]]
    return "His stack, grouped: " + " | ".join(parts) + "."


def _fmt_leetcode(lc: dict) -> str:
    tags = ", ".join(f"{t['tag']} ×{t['count']}" for t in lc["strong_tags"][:3])
    return (
        f"He's solved {lc['total_solved']} LeetCode problems — {lc['by_language']['C++']} in C++. "
        f"Badges: {', '.join(lc['badges'])}. Strongest tags: {tags}. Rank #{lc['rank']:,}. Profile: {lc['profile_url']}"
    )


def _fmt_experience(e: dict) -> str:
    cur = e["experience"][0]
    rest = [x for x in e["experience"][1:] if not x["role"].startswith("B.Tech")]
    out = (
        f"He works as {cur['role']} at {cur['company']}, {cur['location']} ({cur['period']}). "
        f"{cur['summary']}"
    )
    if rest:
        past = "; ".join(f"{x['role']} at {x['company']} ({x['period']})" for x in rest)
        out += f" Before that: {past}."
    return out


def retrieve(message: str) -> tuple[str, list[str]]:
    """Compose an answer purely from tool outputs. Returns (text, tools_used)."""
    profile = get_profile()
    routes = _route(message)
    parts: list[str] = []
    used: list[str] = []
    for r in routes:
        if r in ("codenest", "teamchat", "docflow", "posture", "videocall", "cliagent"):
            parts.append(_fmt_project_detail(get_project_details(r)))
            used.append("get_project_details")
        elif r == "ai":
            parts.append(_fmt_ai(get_projects(), profile))
            used += ["get_projects", "get_profile"]
        elif r == "skills":
            parts.append(_fmt_skills(get_skills()))
            used.append("get_skills")
        elif r == "leetcode":
            parts.append(_fmt_leetcode(get_leetcode()))
            used.append("get_leetcode")
        elif r == "education":
            edu = profile["education"]
            parts.append(f"He's completed his {edu['degree']} at {edu['institute']}. Earlier: {edu['class_xii']}.")
            used.append("get_profile")
        elif r == "experience":
            parts.append(_fmt_experience(get_experience()))
            used.append("get_experience")
        elif r == "contact":
            parts.append(f"Best way to reach him: {profile['email']}. GitHub: {profile['links']['github']}. LinkedIn: {profile['links']['linkedin']}.")
            used.append("get_profile")
        elif r == "github":
            g = get_github_projects()
            parts.append(f"GitHub: {g['github']['profile_url']} — {g['github']['public_repos']} public repos. Start with the featured projects in the Work section.")
            used.append("get_github_projects")
        elif r == "projects":
            parts.append(_fmt_projects(get_projects()))
            used.append("get_projects")
        elif r == "who":
            parts.append(_fmt_who(profile))
            used.append("get_profile")
    # de-dupe tool names
    tools = list(dict.fromkeys(used))
    return "\n\n".join(parts), tools


async def answer_async(message: str, mode: str = "mohit") -> dict[str, Any]:
    """Answer one chat message. Always reports the engine used."""
    text = (message or "").strip()
    if not text:
        return {"response": "Ask me something about Mohit — his work, projects, skills, or background.", "engine": "none", "tools_used": []}
    if mode == "general":
        if not has_llm_key():
            return {"response": NEEDS_KEY_MSG, "engine": "needs-key", "tools_used": []}
        try:
            out, tools = await asyncio.wait_for(_run_general(text[:2000]), timeout=90)
            return {"response": out, "engine": "adk-general", "tools_used": tools}
        except Exception:
            return {"response": "Sorry — the general model didn't answer. Try again in a moment.", "engine": "error", "tools_used": []}
    if has_llm_key():
        try:
            out, tools = await asyncio.wait_for(_run_adk(text[:1000]), timeout=60)
            return {"response": out, "engine": "adk-gemini", "tools_used": tools}
        except Exception as exc:  # never leak internals; fall back transparently
            fallback, tools = retrieve(text)
            return {"response": fallback, "engine": "retrieval", "tools_used": tools, "note": f"LLM unavailable ({type(exc).__name__}); answered from verified data."}
    fallback, tools = retrieve(text[:1000])
    return {"response": fallback, "engine": "retrieval", "tools_used": tools}


def answer_sync(message: str) -> dict[str, Any]:
    return asyncio.run(answer_async(message))


# ---------------------------------------------------------------------------
# Streaming: yields {"t": "meta"|"tok"|"done", ...} events so the chat UI can
# render the answer token-by-token in real time.
# ---------------------------------------------------------------------------

def _chunk_text(text: str, words_per_chunk: int = 4) -> list[str]:
    words = text.split(" ")
    out, buf = [], ""
    for w in words:
        buf += (w + " ")
        if len(buf.split(" ")) > words_per_chunk:
            out.append(buf)
            buf = ""
    if buf.strip():
        out.append(buf)
    return out


async def _run_general(message: str) -> tuple[str, list[str]]:
    """Run one general-mode turn (no tools). Returns (text, tools_used)."""
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.genai import types

    agent = build_general_agent()
    session_service = InMemorySessionService()
    runner = Runner(
        app_name="mohit_portfolio",
        agent=agent,
        session_service=session_service,
        auto_create_session=True,
    )
    user_id, session_id = "web", f"general-{uuid.uuid4().hex[:8]}"
    chunks: list[str] = []
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=types.Content(role="user", parts=[types.Part(text=message)]),
    ):
        content = getattr(event, "content", None)
        if content and getattr(content, "parts", None):
            for part in content.parts:
                if getattr(part, "text", None):
                    chunks.append(part.text)
    text = "".join(chunks).strip()
    if not text:
        raise RuntimeError("General agent returned an empty response")
    return text, ["adk:llm"]


async def _stream_adk(message: str, general: bool = False):
    """Yield live text pieces from the ADK Runner as the LLM produces them."""
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.genai import types

    agent = build_general_agent() if general else build_agent()
    session_service = InMemorySessionService()
    runner = Runner(
        app_name="mohit_portfolio",
        agent=agent,
        session_service=session_service,
        auto_create_session=True,
    )
    user_id, session_id = "web", f"web-{uuid.uuid4().hex[:8]}"
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=types.Content(role="user", parts=[types.Part(text=message)]),
    ):
        content = getattr(event, "content", None)
        if content and getattr(content, "parts", None):
            for part in content.parts:
                if getattr(part, "text", None):
                    yield {"t": "tok", "text": part.text}


async def stream_async(message: str, mode: str = "mohit"):
    """Async generator of answer events for SSE streaming."""
    text = (message or "").strip()
    if not text:
        yield {"t": "tok", "text": "Ask me something about Mohit."}
        yield {"t": "done", "engine": "none"}
        return
    if mode == "general":
        if not has_llm_key():
            for piece in _chunk_text(NEEDS_KEY_MSG):
                yield {"t": "tok", "text": piece}
                await asyncio.sleep(0.03)
            yield {"t": "done", "engine": "needs-key"}
            return
        try:
            yield {"t": "meta", "engine": "adk-general"}
            seen_any = False
            async with asyncio.timeout(120):
                async for ev in _stream_adk(text[:2000], general=True):
                    seen_any = True
                    yield ev
            if not seen_any:
                raise RuntimeError("General agent returned an empty response")
            yield {"t": "done", "engine": "adk-general"}
            return
        except Exception:
            yield {"t": "tok", "text": "Sorry — the general model didn't answer. Try again in a moment."}
            yield {"t": "done", "engine": "error"}
            return
    text = text[:1000]
    if has_llm_key():
        try:
            yield {"t": "meta", "engine": "adk-gemini"}
            seen_any = False
            async with asyncio.timeout(90):
                async for ev in _stream_adk(text):
                    seen_any = True
                    yield ev
            if not seen_any:
                raise RuntimeError("ADK agent returned an empty response")
            yield {"t": "done", "engine": "adk-gemini"}
            return
        except Exception:
            pass  # fall through to deterministic retrieval below
    full, tools = retrieve(text)
    yield {"t": "meta", "engine": "retrieval", "tools": tools}
    for piece in _chunk_text(full):
        yield {"t": "tok", "text": piece}
        await asyncio.sleep(0.03)
    yield {"t": "done", "engine": "retrieval"}
