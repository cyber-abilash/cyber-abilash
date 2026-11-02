"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Mail,
  ShieldCheck,
  Code2,
  Menu,
  X,
  Terminal,
  LockKeyhole,
  Sparkles,
  Briefcase,
  GraduationCap,
  GitBranch,
  ExternalLink,
  FolderKanban,
  Loader2,
  Image as ImageIcon,
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
// SKILLS
// ============================================

const skills = [
  "HTML & CSS",
  "JavaScript",
  "React",
  "Next.js",
  "TypeScript",
  "Cybersecurity",
  "UI / UX Design",
  "AI & Automation",
];

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  // ============================================
  // LOAD PROJECTS FROM SUPABASE
  // ============================================

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError("");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!active) return;

      if (error) {
        setProjectsError(error.message);
        setProjects([]);
      } else {
        setProjects((data ?? []) as Project[]);
      }

      setProjectsLoading(false);
    }

    void loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A0F] text-white">

      {/* ========================================
          NAVBAR
      ======================================== */}

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#070A0F]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <a href="#home" className="text-xl font-bold tracking-wider">
            CYBER
            <span className="text-[#00E5A0]"> ABILASH.</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-gray-400 transition hover:text-[#00E5A0]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full border border-[#00E5A0]/50 px-5 py-2.5 text-sm text-[#00E5A0] transition hover:bg-[#00E5A0] hover:text-black md:flex"
          >
            Let's Talk
            <ArrowUpRight size={16} />
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#070A0F] px-6 py-5 md:hidden">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-300 transition hover:text-[#00E5A0]"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="mt-3 block border-t border-white/10 pt-4 text-[#00E5A0]"
            >
              View All Projects →
            </Link>
          </div>
        )}
      </nav>

      {/* ========================================
          HERO SECTION
      ======================================== */}

      <section
        id="home"
        className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-20 pt-36 md:grid-cols-2 md:px-10"
      >
        <div className="pointer-events-none absolute left-[-150px] top-40 h-80 w-80 rounded-full bg-[#00E5A0]/10 blur-[120px]" />

        <div className="relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/5 px-4 py-2 text-xs tracking-widest text-[#00E5A0]"
          >
            <span className="h-2 w-2 rounded-full bg-[#00E5A0]" />
            AVAILABLE FOR NEW OPPORTUNITIES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold leading-[1.1] tracking-tight md:text-8xl"
          >
            Think.
            <br />
            Build.
            <br />
            <span className="text-[#00E5A0]">Secure.</span>
          </motion.h1>

          <p className="mt-8 max-w-lg text-base leading-8 text-gray-400 md:text-lg">
            Hi, I'm Abilash. I explore web development, cybersecurity
            and emerging technologies to create meaningful digital
            experiences.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-3 rounded-full bg-[#00E5A0] px-7 py-4 font-semibold text-black transition hover:scale-105"
            >
              Explore My Work
              <ArrowUpRight size={19} />
            </a>

            <a
              href="#about"
              className="rounded-full border border-white/20 px-7 py-4 text-white transition hover:border-[#00E5A0] hover:text-[#00E5A0]"
            >
              About Me
            </a>
          </div>
        </div>

        {/* HERO VISUAL */}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex items-center justify-center py-10"
        >
          <div className="absolute h-72 w-72 rounded-full bg-[#00E5A0]/10 blur-[100px] md:h-96 md:w-96" />

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative flex h-72 w-72 items-center justify-center rounded-full border border-[#00E5A0]/30 bg-[#101827]/80 shadow-[0_0_100px_rgba(0,229,160,0.12)] md:h-96 md:w-96"
          >
            <div className="absolute inset-5 rounded-full border border-dashed border-[#00E5A0]/30" />

            <div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-[#00E5A0]/30 bg-[#00E5A0]/10 md:h-52 md:w-52">
              <ShieldCheck
                size={110}
                strokeWidth={1}
                className="text-[#00E5A0] md:h-36 md:w-36"
              />
            </div>

            <div className="absolute -right-3 top-12 rounded-xl border border-white/10 bg-[#101827] p-3">
              <Terminal className="text-[#00E5A0]" />
            </div>

            <div className="absolute -bottom-3 left-8 rounded-xl border border-white/10 bg-[#101827] p-3">
              <LockKeyhole className="text-[#00E5A0]" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================
          ABOUT
      ======================================== */}

      <section
        id="about"
        className="border-t border-white/10 px-6 py-28 md:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">

          <div>
            <p className="mb-5 text-sm tracking-[0.3em] text-[#00E5A0]">
              01 / ABOUT ME
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Curious mind.
              <br />
              <span className="text-gray-500">Creative builder.</span>
            </h2>
          </div>

          <div>
            <p className="text-lg leading-9 text-gray-400">
              I am passionate about technology, software development
              and cybersecurity. I enjoy learning new technologies,
              experimenting with ideas and building practical digital
              solutions.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-5">

              <div className="rounded-2xl border border-white/10 bg-[#101827] p-6">
                <GraduationCap className="mb-4 text-[#00E5A0]" size={28} />
                <h3 className="font-semibold">Student</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Always learning
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#101827] p-6">
                <Sparkles className="mb-4 text-[#00E5A0]" size={28} />
                <h3 className="font-semibold">Innovator</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Building new ideas
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SKILLS
      ======================================== */}

      <section
        id="skills"
        className="border-t border-white/10 px-6 py-28 md:px-10"
      >
        <div className="mx-auto max-w-7xl">

          <p className="mb-5 text-sm tracking-[0.3em] text-[#00E5A0]">
            02 / EXPERTISE
          </p>

          <h2 className="text-4xl font-bold md:text-6xl">
            Skills & Technologies
          </h2>

          <p className="mt-5 max-w-xl leading-8 text-gray-400">
            Technologies and tools I am learning and using to
            create modern digital experiences.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-[#101827] p-6 transition hover:-translate-y-1 hover:border-[#00E5A0]/50"
              >
                <Code2 className="mb-6 text-[#00E5A0]" size={25} />
                <h3 className="font-medium">{skill}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          PROJECTS - SUPABASE DYNAMIC DATA
      ======================================== */}

      <section
        id="projects"
        className="border-t border-white/10 px-6 py-28 md:px-10"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-wrap items-end justify-between gap-6">

            <div>
              <p className="mb-5 text-sm tracking-[0.3em] text-[#00E5A0]">
                03 / SELECTED WORK
              </p>

              <h2 className="text-4xl font-bold md:text-6xl">
                Featured Projects.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-gray-400">
                A selection of projects built with creativity,
                technology and passion.
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/40 px-5 py-3 text-sm font-semibold text-[#00E5A0] transition hover:bg-[#00E5A0] hover:text-black"
            >
              View All Projects
              <ArrowUpRight size={17} />
            </Link>

          </div>

          {/* LOADING */}

          {projectsLoading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-[#00E5A0]">
              <Loader2 size={25} className="animate-spin" />
              <span className="text-sm">Loading projects...</span>
            </div>
          ) : projectsError ? (

            /* ERROR */

            <div className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
              <p className="text-red-400">
                Unable to load projects.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {projectsError}
              </p>
            </div>

          ) : projects.length === 0 ? (

            /* EMPTY STATE */

            <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-[#101827]/50 px-5 py-16 text-center">
              <FolderKanban
                size={45}
                className="mx-auto mb-5 text-gray-600"
              />

              <h3 className="text-xl font-semibold">
                Projects Coming Soon
              </h3>

              <p className="mt-3 text-sm text-gray-500">
                New projects will appear here soon.
              </p>

              <Link
                href="/projects"
                className="mt-6 inline-flex items-center gap-2 text-sm text-[#00E5A0] hover:underline"
              >
                Explore Projects
                <ArrowUpRight size={16} />
              </Link>
            </div>

          ) : (

            /* PROJECT CARDS */

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {projects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-[#101827] transition hover:-translate-y-1 hover:border-[#00E5A0]/50"
                >

                  {/* PROJECT IMAGE */}

                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#0B111C]">

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
                        <ImageIcon size={42} />
                        <span className="text-xs">
                          Project Preview
                        </span>
                      </div>
                    )}

                    {project.category && (
                      <span className="absolute left-4 top-4 rounded-full border border-[#00E5A0]/20 bg-black/75 px-3 py-1.5 text-xs text-[#00E5A0] backdrop-blur-md">
                        {project.category}
                      </span>
                    )}

                  </div>

                  {/* PROJECT DETAILS */}

                  <div className="p-7">

                    <h3 className="text-xl font-semibold transition group-hover:text-[#00E5A0]">
                      {project.title}
                    </h3>

                    <p className="mt-4 min-h-[72px] text-sm leading-7 text-gray-400">
                      {project.description ||
                        "No description provided."}
                    </p>

                    {/* TECHNOLOGIES */}

                    <div className="mt-5 flex min-h-8 flex-wrap gap-2">
                      {(project.tech_stack ?? []).map(
                        (tech, techIndex) => (
                          <span
                            key={`${tech}-${techIndex}`}
                            className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>

                    {/* PROJECT LINKS */}

                    <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-5">

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-sm text-gray-300 transition hover:border-white/30 hover:text-white"
                          aria-label={`GitHub for ${project.title}`}
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
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00E5A0] px-3 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                          aria-label={`Live demo for ${project.title}`}
                        >
                          <ExternalLink size={17} />
                          Live Demo
                        </a>
                      )}

                      {!project.github_url && !project.live_url && (
                        <p className="text-xs text-gray-500">
                          Project links coming soon.
                        </p>
                      )}

                    </div>
                  </div>
                </motion.article>
              ))}

            </div>
          )}

          {/* VIEW ALL */}

          {!projectsLoading && projects.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#00E5A0] hover:text-[#00E5A0]"
              >
                Explore All Projects
                <ArrowUpRight size={18} />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ========================================
          CONTACT
      ======================================== */}

      <section
        id="contact"
        className="border-t border-white/10 px-6 py-32 text-center md:px-10"
        >
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 text-sm tracking-[0.3em] text-[#00E5A0]">
            04 / GET IN TOUCH
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Have an idea?
            <br />
            <span className="text-[#00E5A0]">Let's build it.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            I'm always interested in discussing technology, software
            development, cybersecurity and innovative projects.
            Feel free to connect with me.
          </p>

          <a
            href="mailto:hello@example.com"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#00E5A0] px-8 py-4 font-semibold text-black transition hover:scale-105"
          >
            <Mail size={19} />
            Contact Me
            <ArrowUpRight size={19} />
          </a>
        </div>
      </section>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="border-t border-white/10 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <a href="#home" className="text-lg font-bold tracking-wider">
            CYBER
            <span className="text-[#00E5A0]"> ABILASH.</span>
          </a>

          <p className="text-sm text-gray-500">
            Think Beyond. Build Secure.
          </p>

          <p className="text-xs text-gray-600">
            © 2026 CYBER ABILASH. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}