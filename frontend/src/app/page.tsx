"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  LayoutDashboard,
  BookOpen,
  Settings,
  ChevronDown,
  GitBranch,
  Database,
  Sparkles,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  CircleDot,
  Command,
  ArrowRight,
  MoreHorizontal,
  Star,
  Zap,
  Activity,
  FileCode2,
  MessageSquare,
} from "lucide-react";

type Repository = {
  id: string | number;
  fullName: string;
  fileCount: number;
  chunkCount: number;
  status: string;
  lastSyncedAt?: string | null;
};

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [repoData, setRepoData] = useState<Repository[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          repositoryId: "429ae4d8-2ec3-43eb-a647-e17ac9261f6a",
        }),
      });

      const data = await res.json();
      setAnswer(data.answer);
      console.log("AI Response:", data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const repositories = repoData.map((repo) => {
  const [owner, name] = repo.fullName.split("/");

    return {
      id: repo.id,
      name,
      owner,
      description: "Repository connected to RepoMind",
      language: "Unknown",
      color: "#a78bfa",
      stars: 0,
      files: repo.fileCount,
      chunks: repo.chunkCount,
      status: repo.status === "READY" ? "Indexed" : "Pending",
      updated: repo.lastSyncedAt
        ? new Date(repo.lastSyncedAt).toLocaleDateString()
        : "Not synced",
    };
  });

  const filteredRepos = repositories.filter((repo) =>
    `${repo.name} ${repo.owner}`.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/repositories`,
        );
        const data = await res.json();
        setRepoData(data);
        console.log("Repositories:", data);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0c0c0f] md:flex">
          <div className="flex h-[72px] items-center gap-3 border-b border-white/[0.07] px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight">
                RepoMind
              </p>
              <p className="text-[11px] text-zinc-500">AI code intelligence</p>
            </div>
          </div>

          <div className="px-4 pt-6">
            <p className="mb-3 px-2 text-[10px] font-semibold tracking-[0.16em] text-zinc-600">
              WORKSPACE
            </p>

            <nav className="space-y-1">
              {[
                { name: "Overview", icon: LayoutDashboard },
                { name: "Repositories", icon: GitBranch },
                { name: "AI Search", icon: Search },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeNav === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-white/[0.07] text-white"
                        : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}
                    {item.name === "AI Search" && (
                      <span className="ml-auto rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-400">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <p className="mb-3 mt-8 px-2 text-[10px] font-semibold tracking-[0.16em] text-zinc-600">
              KNOWLEDGE
            </p>

            <nav className="space-y-1">
              {[
                { name: "Code Explorer", icon: FileCode2 },
                { name: "Documentation", icon: BookOpen },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeNav === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-white/[0.07] text-white"
                        : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.10] to-transparent p-4">
              <div className="mb-2 flex items-center gap-2 text-violet-300">
                <Zap size={15} />
                <span className="text-xs font-medium">AI-powered codebase</span>
              </div>
              <p className="text-xs leading-5 text-zinc-500">
                Understand your codebase faster with RepoMind AI.
              </p>
              <button className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200">
                Explore AI Search <ArrowRight size={13} />
              </button>
            </div>

            <button
              onClick={() => setActiveNav("Settings")}
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 hover:bg-white/[0.04] hover:text-white"
            >
              <Settings size={17} />
              Settings
            </button>

            <div className="mt-3 flex items-center gap-3 border-t border-white/[0.07] pt-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
                K
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-300">
                  Karan
                </p>
                <p className="text-[11px] text-zinc-600">Free plan</p>
              </div>
              <MoreHorizontal size={17} className="text-zinc-600" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="flex h-[72px] items-center justify-between border-b border-white/[0.07] px-5 md:px-9">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Workspace</span>
              <span className="text-zinc-700">/</span>
              <span className="font-medium text-zinc-200">{activeNav}</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-500 transition hover:bg-white/[0.05] sm:flex">
                <Command size={13} />
                <span>Search</span>
                <span className="ml-2 rounded border border-white/10 px-1.5 py-0.5 text-[10px]">
                  Ctrl K
                </span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-500 hover:bg-white/[0.05] hover:text-white">
                <Settings size={15} />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1200px] px-5 py-9 md:px-9 md:py-12">
            {/* Greeting */}
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-zinc-500">
                    Your workspace is ready
                  </span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Understand your code,{" "}
                  <span className="text-zinc-500">faster.</span>
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  Ask questions, explore repositories, and navigate your
                  codebase with AI.
                </p>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium shadow-lg shadow-violet-600/10 transition hover:bg-violet-500">
                <Plus size={16} />
                Add repository
              </button>
            </div>

            {/* AI Search */}
            <div className="relative mt-9 overflow-hidden rounded-2xl border border-violet-500/20 bg-[#111116] p-5 md:p-7">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-600/[0.09] blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ask RepoMind</p>
                    <p className="text-xs text-zinc-600">
                      AI-powered codebase intelligence
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.09] bg-[#0b0b0e] p-2 transition focus-within:border-violet-500/40">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about your codebase..."
                    rows={2}
                    className="w-full resize-none bg-transparent px-3 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                  />
                  <div className="flex flex-col gap-2 border-t border-white/[0.06] px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button className="flex w-fit items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-500 hover:bg-white/[0.04]">
                      <GitBranch size={14} />
                      Select repository
                      <ChevronDown size={13} />
                    </button>
                    <button
                      onClick={handleAsk}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? "Thinking..." : "Ask question"}
                      {!isLoading && <ArrowUpRight size={14} />}
                    </button>
                  </div>
                </div>

                {answer && (
                  <div className="mt-6 rounded-xl border border-white/[0.09] bg-[#0e0e11] p-5">
                    <h3 className="mb-3 text-sm font-semibold text-violet-400">
                      AI Answer
                    </h3>
                    <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                      {answer}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Explain the project architecture",
                    "Where is authentication handled?",
                    "Find API endpoints",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="rounded-full border border-white/[0.07] px-3 py-1.5 text-xs text-zinc-500 transition hover:border-violet-500/30 hover:text-violet-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                {
                  label: "Repositories",
                  value: repoData.length,
                  icon: GitBranch,
                  note: "Connected",
                },
                {
                  label: "Files indexed",
                  value: repoData.reduce(
                    (sum, repo) => sum + repo.fileCount,
                    0,
                  ),
                  icon: FileCode2,
                  note: "Across repositories",
                },
                {
                  label: "Code chunks",
                  value: repoData.reduce((sum, repo) => sum + repo.chunkCount, 0),
                  icon: Database,
                  note: "Available for search",
                },
                {
                  label: "AI searches",
                  value: "—",
                  icon: Activity,
                  note: "Start exploring",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/[0.07] bg-[#0e0e11] p-4 md:p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                      <Icon size={15} className="text-zinc-600" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-600">
                      {stat.note}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Repository section */}
            <div className="mt-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold">Your repositories</h2>
                  <p className="mt-1 text-xs text-zinc-600">
                    Codebases connected to your workspace
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0e0e11] px-3 py-2">
                  <Search size={14} className="text-zinc-600" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter repositories..."
                    className="w-40 bg-transparent text-xs outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.name}
                    className="group rounded-xl border border-white/[0.07] bg-[#0e0e11] p-5 transition hover:border-white/[0.13] hover:bg-[#111114]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                          <GitBranch size={18} className="text-zinc-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-200 transition group-hover:text-violet-300">
                            {repo.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-zinc-600">
                            {repo.owner}/{repo.name}
                          </p>
                        </div>
                      </div>
                      <button className="rounded-md p-1.5 text-zinc-600 hover:bg-white/[0.05] hover:text-zinc-300">
                        <MoreHorizontal size={17} />
                      </button>
                    </div>

                    <p className="mt-4 line-clamp-1 text-xs text-zinc-500">
                      {repo.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-zinc-600">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: repo.color }}
                        />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={12} /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCode2 size={12} /> {repo.files} files
                      </span>
                      <span className="flex items-center gap-1">
                        <Database size={12} /> {repo.chunks} chunks
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                      <span
                        className={`flex items-center gap-1.5 text-[11px] ${
                          repo.status === "Indexed"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {repo.status === "Indexed" ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Clock3 size={13} />
                        )}
                        {repo.status}
                      </span>
                      <button className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-white">
                        Explore repository <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRepos.length === 0 && (
                <div className="mt-4 rounded-xl border border-dashed border-white/10 p-10 text-center">
                  <Search className="mx-auto mb-3 text-zinc-600" size={20} />
                  <p className="text-sm text-zinc-400">No repositories found</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Try searching with a different name.
                  </p>
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="mt-10">
              <h2 className="text-base font-semibold">Recent activity</h2>
              <p className="mt-1 text-xs text-zinc-600">
                Latest workspace events
              </p>

              <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#0e0e11] p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emer emerald-500/10 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-zinc-300">
                      <span className="font-medium">BG-Removal</span>{" "}
                      successfully indexed
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      67 files discovered · 49 code chunks created
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[10px] text-zinc-700">
                      <Clock3 size={11} /> October 17
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-zinc-700">
                RepoMind <span className="text-zinc-800">·</span> AI code
                intelligence
              </p>
              <div className="flex items-center gap-4 text-[11px] text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <CircleDot size={11} className="text-emerald-500" />
                  All systems operational
                </span>
                <span>v0.1.0</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
