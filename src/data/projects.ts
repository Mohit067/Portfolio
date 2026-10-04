export type ProjectCategory =
  | "FULL STACK"
  | "REAL-TIME"
  | "DEVELOPER TOOLS"
  | "AI"
  | "GAMES"
  | "EXPERIMENTS";

export interface Project {
  id: string;
  index: string;
  title: string;
  short: string;
  category: ProjectCategory[];
  description: string;
  problem: string;
  solution: string;
  architecture: string[];
  architectureNote: string;
  features: string[];
  technologies: string[];
  engineering: string[];
  metrics: { value: string; label: string }[];
  github: { label: string; url: string }[];
  demo?: { label: string; url: string };
  live?: { label: string; url: string };
  featured: boolean;
  verified: string;
}

export const projects: Project[] = [
  {
    id: "codenest",
    index: "01",
    title: "CodeNest — Cloud IDE",
    short: "A browser-based code editor with Docker, terminal, and live preview.",
    category: ["DEVELOPER TOOLS", "FULL STACK"],
    description:
      "A code editor that runs in the browser. It uses Docker, has a terminal and live preview, and sets up in under 2 minutes.",
    problem:
      "New contributors and students lose hours configuring local toolchains, SDK versions, and editor setups before writing a single line of code.",
    solution:
      "Ship the environment with the code: per-session Docker containers provisioned on demand, a React workspace UI with terminal + preview, and session-scoped sync so feedback cycles stay tight.",
    architecture: ["User", "React Frontend", "Node / Express API", "Docker Container", "Execution Environment"],
    architectureNote: "Supported by repo + resume: React frontend, Node/Express backend, Docker containers.",
    features: [
      "One-click containerized dev environments (< 2 min setup)",
      "Live browser preview of running apps",
      "In-editor terminal support",
      "In-browser CLI with 20+ commands",
      "Session-based code synchronization",
    ],
    technologies: ["JavaScript", "React", "Node.js", "Express", "Docker"],
    engineering: [
      "Container-per-session isolation for reproducible environments",
      "Session-scoped sync channel to avoid stale file state",
      "Terminal multiplexing inside the browser workspace",
    ],
    metrics: [
      { value: "<2 min", label: "env setup time" },
      { value: "20+", label: "in-browser CLI commands" },
      { value: "~35%", label: "faster feedback cycles*" },
    ],
    github: [{ label: "Repository", url: "https://github.com/Mohit067/Project-IDX-Clone" }],
    live: { label: "Live App", url: "https://project-idx-clone.vercel.app" },
    demo: {
      label: "Demo Video",
      url: "https://drive.google.com/file/d/1zeTKJGKx_ZunfSEXzSofd0vXM0Arxvfy/view?pli=1",
    },
    featured: true,
    verified: "Repo README + live deployment verified. *Metric from resume (self-reported testing).",
  },
  {
    id: "slack-clone",
    index: "02",
    title: "Realtime Team Chat",
    short: "A real-time chat app with login, private chats, payments, and file uploads.",
    category: ["REAL-TIME", "FULL STACK"],
    description:
      "A real-time chat app with login, private chats, payments, and file uploads.",
    problem:
      "Team chat needs to feel instant while also handling auth, permissions, file uploads, payments, and background work without blocking the message path.",
    solution:
      "A Socket.IO event layer for sub-200ms delivery, REST APIs for everything else, Redis-backed Bull queues for async tasks, and S3 for media — with RBAC enforced at the API and socket layers.",
    architecture: ["User", "React App", "Node / Express API", "Socket.IO Layer", "MongoDB + Bull + S3"],
    architectureNote: "Supported by backend README (Socket.IO, Bull, Nodemailer) + resume stack.",
    features: [
      "Real-time channels & private chats (Socket.IO)",
      "JWT authentication + role-based access control",
      "Razorpay sandbox payments (50+ test transactions)",
      "AWS S3 media storage",
      "Bull queues for background / async tasks",
    ],
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT", "Bull", "Razorpay", "AWS S3"],
    engineering: [
      "Socket event design separating presence, messages, and typing signals",
      "RBAC checks on REST + socket handshake paths",
      "Offloading mail/media work to Bull queues to protect latency",
    ],
    metrics: [
      { value: "<200ms", label: "message latency (active users)*" },
      { value: "50+", label: "sandbox payment transactions" },
    ],
    github: [
      { label: "Frontend", url: "https://github.com/Mohit067/Slack_Frontend" },
      { label: "Backend", url: "https://github.com/Mohit067/Slack_Backend" },
    ],
    demo: {
      label: "Demo Video",
      url: "https://drive.google.com/file/d/1YiM_q0TsyLX1b1ehFG7L0UsJ9MPOmGzW/view",
    },
    featured: true,
    verified: "Both repos verified on GitHub. *Latency from resume (self-reported).",
  },
  {
    id: "doc-uploader",
    index: "03",
    title: "Document Flow & Alerts",
    short: "A document upload app with deadlines and email reminders.",
    category: ["FULL STACK"],
    description:
      "A document upload app with login roles, deadline tracking, and email reminders.",
    problem:
      "Client document workflows miss deadlines because uploads, reviews, and reminders live in disconnected tools and inboxes.",
    solution:
      "One pipeline: role-scoped uploads, deadline metadata on every document, cron-driven reminder sweeps, and a dashboard that surfaces what's due — with indexed queries keeping search fast.",
    architecture: ["Client", "React App", "Express API", "MongoDB", "Cron → Email Notifications"],
    architectureNote: "Supported by repo pair + resume stack (React/Express/Mongo/NodeMailer/Cron).",
    features: [
      "Role-based upload & review workflow",
      "Automated email alerts (NodeMailer + Cron)",
      "Real-time deadline-tracking dashboard",
      "Optimized MongoDB queries for document search",
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "NodeMailer", "Cron Jobs"],
    engineering: [
      "Deadline-aware document schema with indexed due-date queries",
      "Cron sweep design for reminder fan-out without duplicate sends",
      "RBAC separation between client and reviewer surfaces",
    ],
    metrics: [
      { value: "−70%", label: "missed deadlines in testing*" },
      { value: "+40%", label: "document search/access speed*" },
    ],
    github: [
      { label: "Frontend", url: "https://github.com/Mohit067/Document_Uploader_Frontend" },
      { label: "Backend", url: "https://github.com/Mohit067/Document_Uploader_Backend" },
    ],
    demo: {
      label: "Demo Video",
      url: "https://drive.google.com/file/d/1oP34hJtlXm1p0E46XjNkzuPs2o7DhVl4/view",
    },
    featured: true,
    verified: "Both repos verified on GitHub. *Metrics from resume (self-reported testing).",
  },
  {
    id: "posture",
    index: "04",
    title: "Bad-Posture Detection",
    short: "A posture monitor with a live dashboard.",
    category: ["AI", "FULL STACK"],
    description:
      "A full-stack app that watches your sitting posture and shows it on a dashboard.",
    problem: "Desk workers develop back and neck strain without any feedback loop on sitting posture.",
    solution:
      "Stream pose signals to a backend inference endpoint and render live posture state, session history, and alerts in a React dashboard.",
    architecture: ["Camera Input", "React Dashboard", "Node Backend", "Posture Model", "Alert Feed"],
    architectureNote: "Repo structure verified (Frontend/Backend/README repos); model internals not inspected in depth.",
    features: ["Live posture dashboard", "Dedicated inference backend", "Session history & alerts", "Documented model workflow"],
    technologies: ["JavaScript", "React", "Node.js", "Express", "Machine Learning"],
    engineering: ["Split inference API from presentation layer", "Streaming-friendly endpoint design", "Dashboard state for live feedback"],
    metrics: [{ value: "3-repo", label: "frontend · backend · model docs" }],
    github: [
      { label: "Frontend", url: "https://github.com/Mohit067/Bad-Posture-Detection-Frontend" },
      { label: "Backend", url: "https://github.com/Mohit067/Bad-Posture-Detection-Backend" },
    ],
    featured: true,
    verified: "Repos verified; treat model accuracy claims as unverified.",
  },
  {
    id: "video-calling",
    index: "05",
    title: "Video Calling App",
    short: "Video rooms with a typed signaling backend.",
    category: ["REAL-TIME", "FULL STACK"],
    description:
      "A video calling app with rooms, built fully in TypeScript.",
    problem: "Browser video calls need reliable signaling and room state before any media can flow.",
    solution: "A typed signaling backend managing rooms and offers/answers, with a TypeScript frontend handling peer connections and call UI.",
    architecture: ["User", "TypeScript Frontend", "Signaling API", "Peer Sessions"],
    architectureNote: "Repo pair verified; signaling transport details per code (not re-verified line-by-line).",
    features: ["Room-based video sessions", "Signaling backend", "Typed end-to-end codebase"],
    technologies: ["TypeScript", "React", "Node.js", "Express", "WebRTC signaling"],
    engineering: ["Room lifecycle management", "Offer/answer signaling flow", "Full TypeScript typing across client/server"],
    metrics: [{ value: "2-repo", label: "typed client + server" }],
    github: [
      { label: "Frontend", url: "https://github.com/Mohit067/Video_Calling_App_Frontend" },
      { label: "Backend", url: "https://github.com/Mohit067/Video_Calling_App_Backend" },
    ],
    featured: true,
    verified: "Repo pair verified on GitHub.",
  },
  {
    id: "cli-agent",
    index: "06",
    title: "CLI Agent (Python)",
    short: "An AI agent for the terminal that uses tools.",
    category: ["AI", "EXPERIMENTS"],
    description:
      "An AI agent for the terminal. It takes plain-English requests and runs tasks with tools.",
    problem: "Repetitive terminal workflows still require manual, step-by-step human operation.",
    solution: "Wrap an LLM reasoning loop in a CLI with a tool registry so natural-language requests become executed shell/file operations.",
    architecture: ["User Prompt", "Agent Loop (Python)", "Tool Registry", "Shell / Filesystem"],
    architectureNote: "High-level pattern; repo README uses non-ASCII and was only partially readable — details per code.",
    features: ["Natural-language terminal commands", "Multi-step task loop", "Extensible tool registry"],
    technologies: ["Python", "LLM APIs"],
    engineering: ["Agent loop with tool-calling", "Safe command execution boundaries", "Terminal UX for agent feedback"],
    metrics: [{ value: "2026", label: "active AI-experiment track" }],
    github: [{ label: "Repository", url: "https://github.com/Mohit067/CLI_Agent" }],
    featured: true,
    verified: "Repo verified (Python, starred). Implementation details per source code.",
  },
  {
    id: "tic-tac-toe-react",
    index: "07",
    title: "Tic Tac Toe (React)",
    short: "Two-player Tic Tac Toe in React with win detection — playable live.",
    category: ["GAMES"],
    description:
      "A two-player Tic Tac Toe game built with React 19 + Vite. Tracks turns, detects wins/draws, and surfaces results with toast notifications.",
    problem:
      "A classic game is the fastest way to learn real React state: turns, derived win state, and reset flows all have to stay perfectly in sync.",
    solution:
      "Model the board as a single state array, derive winner/draw on every move, and keep the UI (grid + toasts + reset) a pure function of that state.",
    architecture: ["Player", "React Board UI", "Game State + Win Check", "Toast / Reset"],
    architectureNote: "Verified via repo package.json (React 19, Vite 6, react-toastify) + live deployment.",
    features: [
      "Two-player local gameplay",
      "Win + draw detection",
      "Toast notifications for results",
      "One-click board reset",
    ],
    technologies: ["JavaScript", "React", "Vite", "CSS"],
    engineering: [
      "Single-source-of-truth board state",
      "Derived win/draw evaluation per move",
      "Reset flow without stale state",
    ],
    metrics: [{ value: "Live", label: "playable demo on Netlify" }],
    github: [{ label: "Repository", url: "https://github.com/Mohit067/Tic_Tac_Toi_React" }],
    live: { label: "Live Demo", url: "https://zingy-platypus-cefe59.netlify.app/" },
    featured: true,
    verified: "Repo + live deployment verified (HTTP 200).",
  },
  {
    id: "ping-pong",
    index: "08",
    title: "Ping Pong Game",
    short: "Two-player browser Pong with keyboard paddles and live scoring.",
    category: ["GAMES"],
    description:
      "A two-player Ping Pong game in vanilla JavaScript. Move paddles with the keyboard, rally the ball, and race on the scoreboard.",
    problem:
      "Real-time game feel in the browser needs a tight loop: input, ball physics, collision, and score all updating without jank.",
    solution:
      "A request loop driving ball/paddle positions in JS with keyboard input handling, collision checks, and a live scoreboard with rounds.",
    architecture: ["Players", "Keyboard Input", "Game Loop (JS)", "Arena + Scoreboard"],
    architectureNote: "Verified via repo source (index.html + script.js + style.css) + live deployment.",
    features: [
      "Two-player paddle controls (keyboard)",
      "Ball physics with randomized direction",
      "Live scoreboard with rounds",
      "Start / reset game flow",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    engineering: [
      "Game-loop timing for smooth ball/paddle motion",
      "Paddle-ball collision handling",
      "Score + round state management",
    ],
    metrics: [{ value: "Live", label: "playable demo on Netlify" }],
    github: [{ label: "Repository", url: "https://github.com/Mohit067/Ping_Pong_Game" }],
    live: { label: "Live Demo", url: "https://fancy-ping-pong-0dd892.netlify.app/" },
    featured: true,
    verified: "Repo + live deployment verified (HTTP 200).",
  },
  {
    id: "snake",
    index: "09",
    title: "Snake Game",
    short: "Classic Snake in vanilla JS — eat, grow, and don't hit the wall.",
    category: ["GAMES"],
    description:
      "The classic Snake game in vanilla JavaScript. Steer the snake, eat food to grow, and chase a high score without crashing.",
    problem:
      "Snake looks simple but needs precise grid movement, growth, collision, and food-spawn logic to feel right.",
    solution:
      "A grid-based loop: snake body as a queue, food spawned on free cells, and collision checks for walls and self on every tick.",
    architecture: ["Player", "Keyboard Input", "Game Loop (JS)", "Grid + Score"],
    architectureNote: "Verified via repo source (index.html + script.js + style.css) + live deployment.",
    features: [
      "Grid movement with keyboard controls",
      "Food spawning + snake growth",
      "Wall and self-collision game-over",
      "Score tracking",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    engineering: [
      "Queue-based snake body updates",
      "Collision detection on every tick",
      "Food spawn avoiding occupied cells",
    ],
    metrics: [{ value: "Live", label: "playable demo on Netlify" }],
    github: [{ label: "Repository", url: "https://github.com/Mohit067/Snake-Game" }],
    live: { label: "Live Demo", url: "https://friends-game-69d1cd.netlify.app/" },
    featured: true,
    verified: "Repo + live deployment verified (HTTP 200).",
  },
  {
    id: "hangman",
    index: "10",
    title: "Hangman Game (React)",
    short: "Word-guessing Hangman in React with lives and game states.",
    category: ["GAMES"],
    description:
      "A Hangman word-guessing game built with React 18 + Vite + Tailwind + Zustand. Guess letters, track remaining lives, and win or lose the round.",
    problem:
      "Hangman needs clean round state: guessed letters, masked word, remaining lives, and win/lose transitions must never desync.",
    solution:
      "Centralize round state in a Zustand store with React Router screens, masking the word from guesses and deriving win/lose as pure state.",
    architecture: ["Player", "React UI (Tailwind)", "Zustand Game Store", "Word List / JSON Server"],
    architectureNote: "Verified via repo package.json (React 18, Zustand, React Router, Tailwind). No live homepage set on the repo.",
    features: [
      "Letter guessing with masked word display",
      "Lives / attempt tracking",
      "Win + game-over states",
      "Routed game screens",
    ],
    technologies: ["JavaScript", "React", "Vite", "Tailwind CSS", "Zustand"],
    engineering: [
      "Zustand store for round lifecycle",
      "Derived masked-word + win/lose checks",
      "Reusable word-source via JSON server repo",
    ],
    metrics: [{ value: "React", label: "Zustand-powered game state" }],
    github: [
      { label: "Repository", url: "https://github.com/Mohit067/Hangman_Game" },
      { label: "Word API", url: "https://github.com/Mohit067/Hangman-JSON-server" },
    ],
    live: { label: "Play in Browser", url: "https://stackblitz.com/github/Mohit067/Hangman_Game" },
    featured: true,
    verified: "Repos verified on GitHub; no Netlify/Vercel deployment set — plays via one-click browser dev environment.",
  },
  {
    id: "simon-say",
    index: "11",
    title: "Simon Say Game",
    short: "Simon-style memory game — repeat the growing color sequence.",
    category: ["GAMES"],
    description:
      "A Simon-style memory game in vanilla JavaScript. Watch the flashing color sequence, repeat it back, and climb levels with a high-score chase.",
    problem:
      "Memory games need strict sequencing: the game must flash, listen, and validate in exact order without accepting out-of-turn input.",
    solution:
      "Separate game vs. user sequences in state, flash one new color per level, then validate each click in order before advancing.",
    architecture: ["Player", "Color Pad UI", "Sequence State (JS)", "Level + High Score"],
    architectureNote: "Verified via repo source (index.html + script.js + style.css). No live homepage set on the repo.",
    features: [
      "Four-color flashing sequence",
      "Level progression with one new step per round",
      "Click-by-click answer validation",
      "High-score tracking across restarts",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    engineering: [
      "Game vs. user sequence separation",
      "Timed flash + input gating per level",
      "Mistake detection with instant feedback",
    ],
    metrics: [{ value: "Levels", label: "endless sequence progression" }],
    github: [{ label: "Repository", url: "https://github.com/Mohit067/Simon_Say" }],
    live: { label: "Play Now", url: "https://raw.githack.com/Mohit067/Simon_Say/main/index.html" },
    featured: true,
    verified: "Repo verified on GitHub; no Netlify/Vercel deployment set — playable instantly (zero-build static site).",
  },
  {
    id: "tic-tac-toe-vanilla",
    index: "12",
    title: "Tic Tac Toe (Vanilla JS)",
    short: "Lightweight no-build Tic Tac Toe in plain HTML/CSS/JS.",
    category: ["GAMES", "EXPERIMENTS"],
    description:
      "An earlier, dependency-free take on Tic Tac Toe in plain HTML, CSS, and JavaScript. Same game, zero build step — open and play.",
    problem:
      "Not every interaction needs a framework; small games should load instantly with no toolchain.",
    solution:
      "Plain DOM grid with direct event handlers and an inline win-check — the simplest version that still plays correctly.",
    architecture: ["Player", "HTML Grid", "Vanilla JS Win Check", "Reset"],
    architectureNote: "Verified via repo source (index.html + script.js + style.css). No live homepage set on the repo.",
    features: [
      "Two-player local gameplay",
      "Win + draw detection",
      "Instant load, no build step",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    engineering: ["DOM-first board rendering", "Inline win-condition checks"],
    metrics: [{ value: "0-dep", label: "no framework, no build" }],
    github: [{ label: "Repository", url: "https://github.com/Mohit067/Tic_Tac_Toe" }],
    live: { label: "Play Now", url: "https://raw.githack.com/Mohit067/Tic_Tac_Toe/main/index.html" },
    featured: false,
    verified: "Repo verified on GitHub; no Netlify/Vercel deployment set — playable instantly (zero-build static site).",
  },
];

export const labRepos = [
  { name: "MCP_Claude", url: "https://github.com/Mohit067/MCP_Claude", lang: "Python", note: "Model Context Protocol + Claude agent experiment." },
  { name: "OCR_agent", url: "https://github.com/Mohit067/OCR_agent", lang: "Python", note: "Document OCR agent pipeline." },
  { name: "Memory", url: "https://github.com/Mohit067/Memory", lang: "Python", note: "Agent memory systems for long-horizon tasks." },
  { name: "LTM-google-adk", url: "https://github.com/Mohit067/LTM-google-adk", lang: "Python", note: "Long-term memory with Google Agent Development Kit." },
  { name: "agent", url: "https://github.com/Mohit067/agent", lang: "Python", note: "General agent scaffolding & trials." },
  { name: "langchain", url: "https://github.com/Mohit067/langchain", lang: "Jupyter", note: "LangChain notebooks & RAG trials." },
  { name: "ML-Toolkit", url: "https://github.com/Mohit067/ML-Toolkit", lang: "Jupyter", note: "ML utilities & learning notebooks." },
  { name: "ScreenTime-Analyzer", url: "https://github.com/Mohit067/ScreenTime-Analyzer", lang: "Python", note: "Screen-time data analysis tool." },
  { name: "Better-auth", url: "https://github.com/Mohit067/Better-auth", lang: "TypeScript", note: "Auth patterns & session experiments." },
  { name: "Streaming_Service", url: "https://github.com/Mohit067/Streaming_Service", lang: "TypeScript", note: "Media streaming service prototype." },
  { name: "PubSub_Library", url: "https://github.com/Mohit067/PubSub_Library", lang: "TypeScript", note: "Hand-rolled pub/sub messaging primitive." },
  { name: "Donation-Dashboard", url: "https://github.com/Mohit067/Donation-Dashboard-frontend", lang: "JavaScript", note: "NGO donation dashboard (frontend + backend repos)." },
  { name: "Find_Job_Portal", url: "https://github.com/Mohit067/Find_Job_Portal", lang: "JavaScript", note: "Job portal prototype." },
  { name: "Leetcode", url: "https://github.com/Mohit067/Leetcode", lang: "C++", note: "DSA solutions archive mirroring LeetCode practice." },
];
