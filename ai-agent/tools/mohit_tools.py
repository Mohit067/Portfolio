"""Tool functions for the Mohit AI agent.

Every function reads from the structured JSON files under ai-agent/data/.
No profile content is hardcoded here — tools are the single source of truth
for both the ADK agent and the deterministic retrieval fallback.
"""
from __future__ import annotations

import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load(name: str) -> dict:
    with open(DATA_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def get_profile() -> dict:
    """Return Mohit's professional profile: role, company, education, links, LeetCode summary."""
    return _load("profile.json")


def get_experience() -> dict:
    """Return Mohit's work experience, internships, education and achievements."""
    return _load("experience.json")


def get_projects() -> dict:
    """Return Mohit's featured projects (one-liners) plus the AI lab list."""
    data = _load("projects.json")
    return {
        "projects": [
            {"id": p["id"], "title": p["title"], "kind": p["kind"], "one_liner": p["one_liner"]}
            for p in data["projects"]
        ],
        "ai_lab": data["ai_lab"],
        "more_on_github": data["more_on_github"],
    }


def get_project_details(project_id: str) -> dict:
    """Return full case-study details for one project by id
    (codenest, teamchat, docflow, posture, videocall, cliagent)."""
    data = _load("projects.json")
    needle = (project_id or "").strip().lower()
    for p in data["projects"]:
        if p["id"] == needle or needle in p["title"].lower():
            return p
    return {"error": f"I don't have verified information about a project called '{project_id}'."}


def get_skills() -> dict:
    """Return Mohit's technical skills grouped by area."""
    return _load("skills.json")


def get_leetcode() -> dict:
    """Return Mohit's verified LeetCode statistics."""
    return _load("profile.json")["leetcode"]


def get_github_projects() -> dict:
    """Return Mohit's GitHub summary with links to key repositories."""
    profile = _load("profile.json")["github"]
    projects = _load("projects.json")
    links: dict[str, str] = {}
    for p in projects["projects"]:
        for label, url in p.get("links", {}).items():
            links[f"{p['title']} ({label})"] = url
    for repo in projects["ai_lab"]:
        links[f"{repo['name']} (lab)"] = repo["url"]
    return {"github": profile, "key_repositories": links}
