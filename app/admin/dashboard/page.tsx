import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { createClient } from "@/lib/supabase-server";
import DashboardClient from "./dashboard-client";

async function DashboardContent() {
  // Render this component at request time
  await connection();

  // Initialize Supabase server client
  const supabase = await createClient();

  // 1. Verify authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin");
  }

  // 2. Verify admin authorization
  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/admin");
  }

  // 3. Get total project count
  const {
    count,
    error: projectError,
  } = await supabase
    .from("projects")
    .select("*", {
      count: "exact",
      head: true,
    });

  const projectCount = projectError ? 0 : count ?? 0;

  // 4. Render dashboard
  return (
    <DashboardClient
      userEmail={user.email ?? ""}
      projectCount={projectCount}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#070A0F] text-emerald-400">
          Loading secure dashboard...
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}