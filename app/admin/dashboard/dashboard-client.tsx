"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  LockKeyhole,
  Activity,
  Code2,
  Globe,
  ArrowUpRight,
  Server,
  Terminal,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface DashboardClientProps {
  projectCount?: number;
  userEmail?: string;
  firstName?: string;
}

const CyberGlobe = dynamic(() => import("./cyber-globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center text-sm text-gray-500">
      Initializing Cyber Globe...
    </div>
  ),
});

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Projects", icon: FolderKanban },
  { name: "Security", icon: ShieldCheck },
  { name: "Profile", icon: User },
  { name: "Settings", icon: Settings },
];

export default function DashboardClient({
  projectCount = 0,
  userEmail = "",
  firstName = "Administrator",
}: DashboardClientProps) {
  const router = useRouter();

  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const displayName =
    firstName !== "Administrator"
      ? firstName
      : userEmail.split("@")[0] || "Administrator";

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError(logoutError.message);
      setLoggingOut(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  const stats = [
    {
      title: "Total Projects",
      value: projectCount,
      icon: FolderKanban,
      description: "Projects in workspace",
    },
    {
      title: "Security Status",
      value: "Active",
      icon: ShieldCheck,
      description: "Admin protection enabled",
    },
    {
      title: "System Status",
      value: "Online",
      icon: Activity,
      description: "Dashboard operational",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#070A0F] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:55px_55px]" />
      </div>

      <div className="relative flex min-h-screen">

        {/* Mobile overlay */}
        {menuOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.08] bg-[#0A1018] p-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-black">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-wide">
                  CYBER<span className="text-emerald-400"> ABILASH</span>
                </h1>
                <p className="text-[10px] tracking-[0.25em] text-gray-500">
                  COMMAND CENTER
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-gray-600">
              WORKSPACE
            </p>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const selected = active === item.name;

                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => {
  setMenuOpen(false);

  if (item.name === "Projects") {
    router.push("/admin/projects");
    return;
  }

  setActive(item.name);
}}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                        : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                    {selected && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto">
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Activity size={16} />
                <span className="text-xs font-semibold">
                  SYSTEM OPERATIONAL
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Your administrator workspace is running.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-400/10 disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">

          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.08] bg-[#070A0F]/80 px-5 backdrop-blur-xl md:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="rounded-xl border border-white/10 p-2 text-gray-300 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-sm font-semibold">
                  {active}
                </p>
                <p className="text-xs text-gray-500">
                  CYBER ABILASH / ADMIN
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-500 sm:flex">
                <Search size={15} />
                Dashboard
              </div>

              <div className="relative rounded-xl border border-white/10 p-2.5 text-gray-400">
                <Bell size={18} />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 font-bold text-emerald-400">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-5 md:p-8">

            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {active === "Overview" ? (
              <>
                {/* Welcome */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium tracking-[0.25em] text-emerald-400">
                        ADMINISTRATOR DASHBOARD
                      </p>

                      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        Welcome back,{" "}
                        <span className="text-emerald-400">
                          {displayName}
                        </span>
                      </h2>

                      <p className="mt-3 text-sm text-gray-500">
                        Monitor your workspace and manage your projects.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-xs text-emerald-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      All Systems Online
                    </div>
                  </div>
                </motion.section>

                {/* Globe and status */}
                <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0D1219] p-5 md:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          Cyber Command Center
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Global security visualization
                        </p>
                      </div>

                      <Globe className="text-emerald-400" size={22} />
                    </div>

                    <CyberGlobe />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0D1219] p-6 md:p-8"
                  >
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                        <Terminal size={23} />
                      </div>

                      <h3 className="mt-6 text-xl font-bold">
                        Workspace Status
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Your administrator workspace is ready. Manage your
                        projects and monitor your platform from one place.
                      </p>
                    </div>

                    <div className="mt-8 space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Platform
                        </span>
                        <span className="text-sm text-emerald-400">
                          Operational
                        </span>
                      </div>

                      <div className="h-px bg-white/[0.08]" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Access
                        </span>
                        <span className="text-sm text-emerald-400">
                          Authorized
                        </span>
                      </div>

                      <div className="h-px bg-white/[0.08]" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Protection
                        </span>
                        <span className="text-sm text-emerald-400">
                          <LockKeyhole className="mr-1 inline" size={14} />
                          Enabled
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </section>

                {/* Statistics */}
                <section className="mb-8 grid gap-5 md:grid-cols-3">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-3xl border border-white/[0.08] bg-[#0D1219] p-6 transition hover:border-emerald-400/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-400">
                            <Icon size={21} />
                          </div>

                          <ArrowUpRight
                            size={18}
                            className="text-gray-600"
                          />
                        </div>

                        <p className="mt-6 text-sm text-gray-500">
                          {stat.title}
                        </p>

                        <h3 className="mt-2 text-3xl font-bold">
                          {stat.value}
                        </h3>

                        <p className="mt-2 text-xs text-gray-600">
                          {stat.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </section>

                {/* Account information */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-white/[0.08] bg-[#0D1219] p-6 md:p-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                      <LockKeyhole size={20} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Account Information
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Administrator details
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm text-gray-500">
                        Account Email
                      </span>
                      <span className="break-all text-sm text-gray-300">
                        {userEmail || "Not available"}
                      </span>
                    </div>

                    <div className="h-px bg-white/[0.08]" />

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">
                        Account Role
                      </span>
                      <span className="text-sm font-medium text-emerald-400">
                        Super Admin
                      </span>
                    </div>

                    <div className="h-px bg-white/[0.08]" />

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">
                        Security
                      </span>
                      <span className="text-sm text-emerald-400">
                        Protected
                      </span>
                    </div>
                  </div>
                </motion.section>
              </>
            ) : (
              <motion.section
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/[0.08] bg-[#0D1219] p-8 md:p-12"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                  {active === "Projects" && <FolderKanban size={26} />}
                  {active === "Security" && <ShieldCheck size={26} />}
                  {active === "Profile" && <User size={26} />}
                  {active === "Settings" && <Settings size={26} />}
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  {active}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                  This section is ready for its next development phase.
                  Its management features have not been connected yet.
                </p>
              </motion.section>
            )}

            {/* Footer */}
            <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-6 text-xs text-gray-600">
              <p>© 2026 CYBER ABILASH. All rights reserved.</p>

              <div className="flex items-center gap-2">
                <Server size={14} />
                Secure Admin Workspace
                <Code2 size={14} />
              </div>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}