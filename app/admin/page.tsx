"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(
          loginError.message === "Invalid login credentials"
            ? "Invalid email or password."
            : loginError.message
        );
        return;
      }

      if (!data.user) {
        setError("Unable to verify your account.");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070A0F] p-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101827] p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00E5A0]/10 text-[#00E5A0]">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            CYBER ABILASH Control Panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none transition focus:border-[#00E5A0] disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-gray-300">
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none transition focus:border-[#00E5A0] disabled:opacity-50"
            />
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E5A0] p-4 font-bold text-black transition hover:bg-[#00c98c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Protected Admin Access
        </p>

        <p className="mt-2 text-center text-[10px] text-gray-700">
          © 2026 CYBER ABILASH
        </p>
      </div>
    </main>
  );
}