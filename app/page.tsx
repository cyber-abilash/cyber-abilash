"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Mail,
  ShieldCheck,
  Code2,
  Menu,
  X,
  Terminal,
  Sparkles,
  GraduationCap,
  GitBranch,
  ExternalLink,
  FolderKanban,
  Loader2,
  Image as ImageIcon,
  Globe,
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
// NAVIGATION
// ============================================

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// ============================================
// 3D CYBER GLOBE
// ============================================

const CyberGlobe = dynamic(
  () => import("@/components/cyber-globe"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center font-mono text-xs tracking-widest text-[#FF2D55] md:h-[520px]">
        INITIALIZING 3D SECURITY SYSTEM...
      </div>
    ),
  }
);

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
    <main className="min-h-screen overflow-hidden bg-[#070A0F]/85 text-white">

      {/* ========================================
          NAVIGATION
      ======================================== */}

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#070A0F]/85 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <a
            href="#home"
            className="text-xl font-black tracking-wider"
          >
            CYBER
            <span className="text-[#FF2D55]"> ABILASH.</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-gray-400 transition hover:text-[#FF2D55]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full border border-[#FF2D55]/50 px-5 py-2.5 text-sm text-[#FF2D55] transition hover:bg-[#FF2D55] hover:text-black md:flex"
          >
            Let&apos;s Talk
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
                className="block py-3 text-gray-300 transition hover:text-[#FF2D55]"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="mt-3 block border-t border-white/10 pt-4 text-[#FF2D55]"
            >
              View All Projects →
            </Link>

          </div>
        )}

      </nav>

      {/* ========================================
          HERO SECTION
      ======================================== */}

      {/* ========================================
          CLASSIFIED PERSONAL HERO SECTION — V3 CINEMATIC
      ======================================== */}

      <section
        id="home"
        className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-20 pt-36 md:grid-cols-2 md:px-10"
      >
        <div className="pointer-events-none absolute left-[-150px] top-40 h-80 w-80 rounded-full bg-[#FF2D55]/10 blur-[120px]" />

        {/* PERSONAL INFORMATION & TELEMETRY */}
        <div className="relative z-10">
          {/* PROFILE IDENTITY BADGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-7 flex items-center gap-5"
          >
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-[#FF2D55] bg-[#0c0c14] p-1 shadow-[0_0_35px_rgba(255,45,85,0.45)] sm:h-36 sm:w-36">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src="/abilash-profile.png"
                  alt="Abilash S"
                  width={144}
                  height={144}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border-2 border-[#0c0c14] bg-[#00E5A0] shadow-[0_0_10px_#00E5A0]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF2D55]/30 bg-[#FF2D55]/10 px-3 py-1 font-mono text-[10px] tracking-widest text-[#FF5575]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF2D55]" />
                IDENTITY VERIFIED // DEFCON 1
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-3xl">
                ABILASH S.
              </h2>
              <p className="mt-1 font-mono text-xs tracking-wider text-gray-300">
                CYBERSECURITY ENTHUSIAST &amp; DEVELOPER
              </p>
              <p className="mt-1 font-mono text-xs tracking-widest text-[#FF2D55]">
                ETHICAL HACKER IN PROGRESS
              </p>
            </div>
          </motion.div>

          {/* MAIN CINEMATIC HERO HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl font-black leading-[1.08] tracking-tight md:text-7xl lg:text-8xl"
          >
            Think.
            <br />
            Build.
            <br />
            <span className="crimson-text-glow bg-gradient-to-r from-[#FF2D55] via-[#FF7590] to-[#FF2D55] bg-clip-text text-transparent">
              Secure.
            </span>
          </motion.h1>

          {/* ETHICAL HACKER STATUS TELEMETRY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 flex items-center gap-3 font-mono text-xs font-bold tracking-widest text-[#FF5575] md:text-sm"
          >
            <span className="h-2 w-2 animate-ping rounded-full bg-[#FF2D55]" />
            <span>OPERATIONAL CLASSIFICATION // ETHICAL HACKER LEARNER</span>
          </motion.div>

          {/* VERIFIED INTRODUCTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 max-w-lg text-base leading-8 text-gray-300"
          >
            Hi, I&apos;m Abilash. I&apos;m a computer science cybersecurity student exploring ethical hacking, Kali Linux, and networking fundamentals. My mission is to master modern defense paradigms and build resilient digital architectures.
          </motion.p>

          {/* VERIFIED PERSONAL DETAILS GRID */}
          <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
            {[
              ["EDUCATION", "B.E. CSE (Cyber Security)"],
              ["COLLEGE", "Sardar Raja College of Engineering"],
              ["LOCATION", "Tenkasi, Tamil Nadu, India"],
              ["CURRENT FOCUS", "Kali Linux & Network Security"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="group rounded-xl border border-white/10 bg-[#101827]/80 p-4 backdrop-blur-xl transition hover:border-[#FF2D55]/50 hover:bg-[#101827]"
              >
                <p className="font-mono text-[9px] tracking-widest text-[#FF2D55]">
                  {label}
                </p>
                <p className="mt-2 text-xs font-semibold text-gray-200">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS WITH MAGNETIC HOVER */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-3 rounded-full bg-[#FF2D55] px-8 py-4 font-semibold text-black shadow-[0_0_25px_rgba(255,45,85,0.45)] transition hover:scale-105 hover:bg-[#ff4d70]"
            >
              Explore My Work
              <ArrowUpRight size={19} />
            </a>

            <a
              href="#contact"
              className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:border-[#FF2D55] hover:text-[#FF2D55]"
            >
              Contact Me
            </a>
          </div>

          {/* CYBERSECURITY PHILOSOPHY */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 max-w-lg rounded-r-2xl border-l-2 border-[#FF2D55] bg-[#FF2D55]/5 p-5 backdrop-blur-md"
          >
            <p className="font-mono text-[10px] tracking-widest text-[#FF2D55]">
              MY CYBERSECURITY PHILOSOPHY
            </p>

            <h3 className="mt-2 text-lg font-bold italic text-white md:text-xl">
              <span className="text-[#FF2D55]">THINK LIKE A HACKER.</span>
              <br />
              DEFEND LIKE A GUARDIAN.
            </h3>

            <p className="mt-2 text-xs text-gray-400">
              Break the limits. Not the laws. | Learn. Build. Secure.
            </p>
          </motion.div>
        </div>

        {/* 3D CYBER SECURITY COMMAND RIG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col items-center justify-center py-6"
        >
          {/* Top HUD Telemetry Tab */}
          <div className="mb-4 flex items-center gap-2 rounded-full border border-[#FF2D55]/30 bg-black/60 px-4 py-1.5 font-mono text-[9px] tracking-widest text-[#FF5575] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF2D55]" />
            <span>GLOBAL THREAT MATRIX // ACTIVE SURVEILLANCE</span>
          </div>

          {/* Preserved 3D Cyber Globe */}
          <CyberGlobe />

          {/* Spatial Note regarding persistent 3D Canvas */}
          <div className="mt-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-gray-500">
            <span>PERSISTENT 3D SHIELD RIG: SYNCHRONIZED</span>
          </div>
        </motion.div>
      </section>

      {/* ========================================
          PREMIUM ABOUT SECTION
      ======================================== */}

      <section
        id="about"
        className="relative overflow-hidden border-t border-white/10 px-6 py-32 md:px-10"
      >

        <div className="pointer-events-none absolute right-[-100px] top-20 h-80 w-80 rounded-full bg-[#FF2D55]/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >

            <p className="mb-5 font-mono text-sm tracking-[0.3em] text-[#FF2D55]">
              01 / ABOUT ME
            </p>

            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Beyond
              <br />
              The <span className="text-[#FF2D55]">Ordinary.</span>
            </h2>

            <p className="mt-8 max-w-xl text-base leading-9 text-gray-400">
              I am Abilash, a technology enthusiast exploring
              cybersecurity, ethical hacking and modern web development.

              I enjoy understanding how systems work, learning new
              technologies and building creative digital experiences.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              {[
                "CYBERSECURITY",
                "WEB DEVELOPMENT",
                "CONTINUOUS LEARNING",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#FF2D55]/25 bg-[#FF2D55]/5 px-4 py-2 font-mono text-[10px] tracking-wider text-[#FF5575]"
                >
                  {item}
                </span>
              ))}

            </div>

          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {[
              {
                icon: GraduationCap,
                title: "Student",
                subtitle: "Learning every day",
                number: "01",
              },
              {
                icon: ShieldCheck,
                title: "Cybersecurity",
                subtitle: "Security-focused learning",
                number: "02",
              },
              {
                icon: Terminal,
                title: "Kali Linux",
                subtitle: "Currently learning",
                number: "03",
              },
              {
                icon: Sparkles,
                title: "Innovation",
                subtitle: "Building new ideas",
                number: "04",
              },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101827]/80 p-7 backdrop-blur-xl transition-colors hover:border-[#FF2D55]/60"
              >

                <span className="absolute right-5 top-5 font-mono text-xs text-gray-700">
                  {item.number}
                </span>

                <item.icon
                  size={30}
                  className="mb-7 text-[#FF2D55] transition-transform group-hover:scale-110"
                />

                <h3 className="text-lg font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {item.subtitle}
                </p>

                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#FF2D55] transition-all duration-500 group-hover:w-full" />

              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* ========================================
          PREMIUM SKILLS SECTION
      ======================================== */}

      <section
        id="skills"
        className="relative overflow-hidden border-t border-white/10 px-6 py-32 md:px-10"
      >

        <div className="mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            <p className="mb-5 font-mono text-sm tracking-[0.3em] text-[#FF2D55]">
              02 / TECHNICAL ARSENAL
            </p>

            <h2 className="text-4xl font-black md:text-6xl">
              Skills & <span className="text-[#FF2D55]">Expertise.</span>
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-gray-400">
              Technologies, tools and concepts I am exploring
              to develop my technical and cybersecurity knowledge.
            </p>

          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[
              {
                icon: ShieldCheck,
                title: "Cybersecurity",
                code: "SEC_01",
                skills: [
                  "Cybersecurity Fundamentals",
                  "Ethical Hacking Concepts",
                  "Kali Linux",
                  "Basic Networking",
                ],
              },
              {
                icon: Code2,
                title: "Web Development",
                code: "DEV_02",
                skills: [
                  "HTML & CSS",
                  "JavaScript",
                  "React.js",
                  "Next.js",
                  "TypeScript",
                ],
              },
              {
                icon: Terminal,
                title: "Tools & Technologies",
                code: "TOOLS_03",
                skills: [
                  "Git & GitHub",
                  "VS Code",
                  "AI & Automation",
                  "Supabase",
                ],
              },
            ].map((group, index) => (
              <motion.div
                key={group.code}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#101827]/80 p-8 backdrop-blur-xl transition-colors hover:border-[#FF2D55]/50"
              >

                <div className="mb-8 flex items-center justify-between">

                  <div className="rounded-xl border border-[#FF2D55]/20 bg-[#FF2D55]/10 p-4">
                    <group.icon size={28} className="text-[#FF2D55]" />
                  </div>

                  <span className="font-mono text-xs tracking-widest text-gray-600">
                    {group.code}
                  </span>

                </div>

                <h3 className="mb-7 text-xl font-bold text-white">
                  {group.title}
                </h3>

                <div className="space-y-4">

                  {group.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-3 text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D55] shadow-[0_0_10px_#FF2D55]" />
                      {skill}
                    </div>
                  ))}

                </div>

                <div className="mt-9 h-px w-full bg-gradient-to-r from-[#FF2D55]/60 to-transparent" />

                <p className="mt-4 font-mono text-[10px] tracking-widest text-gray-600">
                  CONTINUOUSLY LEARNING
                </p>

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

              <p className="mb-5 font-mono text-sm tracking-[0.3em] text-[#FF2D55]">
                03 / SELECTED WORK
              </p>

              <h2 className="text-4xl font-black md:text-6xl">
                Featured Projects.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-gray-400">
                A selection of projects built with creativity,
                technology and passion.
              </p>

            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-[#FF2D55]/40 px-5 py-3 text-sm font-semibold text-[#FF2D55] transition hover:bg-[#FF2D55] hover:text-black"
            >
              View All Projects
              <ArrowUpRight size={17} />
            </Link>

          </div>

          {/* LOADING */}

          {projectsLoading ? (

            <div className="flex min-h-64 items-center justify-center gap-3 text-[#FF2D55]">
              <Loader2 size={25} className="animate-spin" />
              <span className="text-sm">Loading projects...</span>
            </div>

          ) : projectsError ? (

            <div className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">

              <p className="text-red-400">
                Unable to load projects.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {projectsError}
              </p>

            </div>

          ) : projects.length === 0 ? (

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
                className="mt-6 inline-flex items-center gap-2 text-sm text-[#FF2D55] hover:underline"
              >
                Explore Projects
                <ArrowUpRight size={16} />
              </Link>

            </div>

          ) : (

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {projects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-[#101827] transition hover:-translate-y-1 hover:border-[#FF2D55]/50"
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
                        <span className="text-xs">Project Preview</span>
                      </div>

                    )}

                    {project.category && (
                      <span className="absolute left-4 top-4 rounded-full border border-[#FF2D55]/20 bg-black/75 px-3 py-1.5 text-xs text-[#FF2D55] backdrop-blur-md">
                        {project.category}
                      </span>
                    )}

                  </div>

                  {/* PROJECT DETAILS */}

                  <div className="p-7">

                    <h3 className="text-xl font-semibold transition group-hover:text-[#FF2D55]">
                      {project.title}
                    </h3>

                    <p className="mt-4 min-h-[72px] text-sm leading-7 text-gray-400">
                      {project.description || "No description provided."}
                    </p>

                    {/* TECHNOLOGIES */}

                    <div className="mt-5 flex min-h-8 flex-wrap gap-2">

                      {(project.tech_stack ?? []).map((tech, techIndex) => (
                        <span
                          key={`${tech}-${techIndex}`}
                          className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}

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
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2D55] px-3 py-3 text-sm font-semibold text-black transition hover:bg-[#ff5575]"
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

          {!projectsLoading && projects.length > 0 && (
            <div className="mt-12 text-center">

              <Link
                href="/projects"
                className="inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#FF2D55] hover:text-[#FF2D55]"
              >
                Explore All Projects
                <ArrowUpRight size={18} />
              </Link>

            </div>
          )}

        </div>

      </section>

      {/* ========================================
          CONTACT SECTION
      ======================================== */}

      <section
        id="contact"
        className="relative overflow-hidden border-t border-white/10 px-6 py-32 text-center md:px-10"
      >

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF2D55]/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-4xl"
        >

          <p className="mb-5 font-mono text-sm tracking-[0.3em] text-[#FF2D55]">
            04 / GET IN TOUCH
          </p>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            Have an idea?
            <br />
            <span className="text-[#FF2D55]">Let&apos;s build it.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            I&apos;m always interested in discussing technology,
            software development, cybersecurity and innovative projects.
            Feel free to connect with me.
          </p>

          <a
            href="mailto:abiilash.root@gmail.com"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#FF2D55] px-8 py-4 font-semibold text-black transition hover:scale-105"
          >
            <Mail size={19} />
            Contact Me
            <ArrowUpRight size={19} />
          </a>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">

            <a
              href="https://github.com/cyber-abilash"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="rounded-full border border-white/10 p-4 text-gray-400 transition hover:border-[#FF2D55] hover:text-[#FF2D55]"
            >
              <Code2 size={22} />
            </a>

            <a
              href="https://www.linkedin.com/in/abilash-s-679ba8443/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="rounded-full border border-white/10 p-4 text-gray-400 transition hover:border-[#FF2D55] hover:text-[#FF2D55]"
            >
              <Globe size={22} />
            </a>

            <a
              href="https://github.com/cyber-abilash"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub portfolio"
              className="rounded-full border border-white/10 p-4 text-gray-400 transition hover:border-[#FF2D55] hover:text-[#FF2D55]"
            >
              <Globe size={22} />
            </a>

          </div>

        </motion.div>

      </section>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="border-t border-white/10 bg-[#05070B] px-6 py-8 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

          <Link
            href="#home"
            className="text-lg font-black tracking-wider"
          >
            CYBER
            <span className="text-[#FF2D55]"> ABILASH.</span>
          </Link>

          <p className="font-mono text-[10px] tracking-widest text-gray-600">
            THINK BEYOND. BUILD SECURE.
          </p>

          <p className="text-xs text-gray-600">
            © 2026 Abilash S. All rights reserved.
          </p>

        </div>

        <div className="mx-auto mt-6 max-w-7xl border-t border-white/5 pt-5 text-center">
          <p className="font-mono text-[9px] tracking-[0.25em] text-gray-700">
            CLASSIFIED INTERFACE // CYBERSECURITY PORTFOLIO
          </p>
        </div>

      </footer>

    </main>
  );
}