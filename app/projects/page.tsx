"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  FolderKanban,
  Search,
  Code2,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// ============================================
// TYPES
// ============================================

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tech_stack: string[] | null;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  created_at: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH PROJECTS FROM SUPABASE
  // ============================================

  async function loadProjects() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setProjects([]);
    } else {
      setProjects((data ?? []) as Project[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  // ============================================
  // CATEGORIES
  // ============================================

  const categories = useMemo(() => {
    const values = projects
      .map((project) => project.category?.trim())
      .filter((category): category is string => Boolean(category));

    return ["All", ...Array.from(new Set(values))];
  }, [projects]);

  // ============================================
  // SEARCH + FILTER
  // ============================================

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase().trim();

    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category === selectedCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(term) ||
        (project.description ?? "").toLowerCase().includes(term) ||
        (project.category ?? "").toLowerCase().includes(term) ||
        (project.tech_stack ?? []).some((tech) =>
          tech.toLowerCase().includes(term)
        );

      return matchesCategory && matchesSearch;
    });
  }, [projects, search, selectedCategory]);

  // ============================================
  // UI
  // ============================================

  return (
    <main className="min-h-screen bg-[#070A0F] text-white">

      {/* NAVBAR */}

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#070A0F]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5A0]/10 text-[#00E5A0]">
              <ShieldCheck size={23} />
            </div>

            <div>
              <p className="font-bold tracking-wide">
                CYBER <span className="text-[#00E5A0]">ABILASH</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Think Beyond. Build Secure.
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#00E5A0]"
          >
            Back to Home
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#00E5A0]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00E5A0]">
            <Code2 size={15} />
            My Work & Creations
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            My <span className="text-[#00E5A0]">Projects.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Explore my development journey, innovative ideas,
            technologies and projects built with passion.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <div>
              <p className="text-3xl font-bold text-[#00E5A0]">
                {projects.length}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Total Projects
              </p>
            </div>

            <div className="h-12 w-px bg-white/10" />

            <div>
              <p className="text-3xl font-bold text-[#00E5A0]">
                {categories.length - 1}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Categories
              </p>
            </div>

            <div className="h-12 w-px bg-white/10" />

            <div>
              <p className="text-3xl font-bold text-[#00E5A0]">
                {projects.filter((p) => p.github_url).length}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                GitHub Repositories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00E5A0]">
              Portfolio Showcase
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Featured Work
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Discover what I have been building.
            </p>
          </div>

          <button
            onClick={() => void loadProjects()}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 transition hover:border-[#00E5A0]/40 hover:text-[#00E5A0] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Projects
          </button>
        </div>

        {/* SEARCH */}

        <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#101827] px-4 py-3 focus-within:border-[#00E5A0]/50">
          <Search size={19} className="text-gray-500" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects, technologies..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="text-gray-500 hover:text-white"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* CATEGORY FILTER */}

        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                selectedCategory === category
                  ? "border-[#00E5A0] bg-[#00E5A0] text-black"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-[#00E5A0]/40 hover:text-[#00E5A0]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center gap-3 text-[#00E5A0]">
            <Loader2 size={25} className="animate-spin" />
            <span className="text-sm">Loading projects...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <p className="text-red-400">
              Unable to load projects.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
            <button
              onClick={() => void loadProjects()}
              className="mt-5 rounded-xl bg-[#00E5A0] px-5 py-3 text-sm font-semibold text-black"
            >
              Try Again
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#101827]/50 px-5 py-20 text-center">
            <FolderKanban
              size={45}
              className="mx-auto mb-5 text-gray-600"
            />

            <h3 className="text-xl font-semibold">
              {projects.length === 0
                ? "Projects Coming Soon"
                : "No Matching Projects"}
            </h3>

            <p className="mt-3 text-sm text-gray-500">
              {projects.length === 0
                ? "New projects will appear here soon."
                : "Try another search or category."}
            </p>
          </div>
        ) : (

          /* PROJECT CARDS */

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">

            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101827] transition duration-300 hover:-translate-y-1 hover:border-[#00E5A0]/40 hover:shadow-[0_15px_50px_rgba(0,229,160,0.07)]"
              >

                {/* IMAGE */}

                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#0B111C]">

                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-600">
                      <ImageIcon size={45} />
                      <span className="text-xs">
                        Project Preview
                      </span>
                    </div>
                  )}

                  {project.category && (
                    <span className="absolute left-4 top-4 rounded-full border border-[#00E5A0]/20 bg-black/75 px-3 py-1.5 text-xs font-medium text-[#00E5A0] backdrop-blur-md">
                      {project.category}
                    </span>
                  )}

                </div>

                {/* DETAILS */}

                <div className="p-6">

                  <h3 className="text-xl font-bold transition group-hover:text-[#00E5A0]">
                    {project.title}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400">
                    {project.description ||
                      "No description available for this project."}
                  </p>

                  {/* TECH STACK */}

                  <div className="mt-5 flex min-h-8 flex-wrap gap-2">
                    {(project.tech_stack ?? []).map(
                      (tech, index) => (
                        <span
                          key={`${tech}-${index}`}
                          className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5 text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>

                  {/* LINKS */}

                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-gray-300 transition hover:border-white/30 hover:text-white"
                      >
                        <GitBranch size={17} />
                        GitHub
                      </a>
                    )}

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00E5A0] px-3 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                      >
                        <ExternalLink size={17} />
                        Live Demo
                      </a>
                    )}

                    {!project.github_url && !project.live_url && (
                      <p className="text-xs text-gray-500">
                        Links coming soon
                      </p>
                    )}

                  </div>
                </div>
              </article>
            ))}

          </div>
        )}

      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

          <p className="text-sm text-gray-500">
            © 2026 CYBER ABILASH. All rights reserved.
          </p>

          <p className="text-xs tracking-wide text-gray-600">
            THINK BEYOND. BUILD SECURE.
          </p>

        </div>
      </footer>

    </main>
  );
}