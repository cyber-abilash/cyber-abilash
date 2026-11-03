"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  FolderKanban,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
  Code2,
  Image as ImageIcon,
  RefreshCw,
  Upload,
} from "lucide-react";

import Link from "next/link";
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

interface ProjectForm {
  title: string;
  description: string;
  category: string;
  tech_stack: string;
  image_url: string;
  live_url: string;
  github_url: string;
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  category: "",
  tech_stack: "",
  image_url: "",
  live_url: "",
  github_url: "",
};

const STORAGE_BUCKET = "project-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// ============================================
// STORAGE HELPER
// ============================================

// Extract only images belonging to our Supabase bucket.
// External image URLs are never deleted.
function getStorageImagePath(
  imageUrl: string | null
): string | null {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);

    const marker = `/object/public/${STORAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return null;

    const encodedPath = url.pathname.slice(
      markerIndex + marker.length
    );

    return encodedPath
      .split("/")
      .map((part) => decodeURIComponent(part))
      .join("/");
  } catch {
    return null;
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProjectsClient() {
  const router = useRouter();

  // Project states
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");

  // Form states
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Image states
  const [selectedImage, setSelectedImage] = useState<File | null>(
    null
  );

  const [previewUrl, setPreviewUrl] = useState("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Message states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================
  // LOAD PROJECTS
  // ============================================

  const loadProjects = useCallback(async () => {
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
  }, []);
  useEffect(() => {
    let active = true;

    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!active) return;

        if (fetchError) {
          setError(fetchError.message);
          setProjects([]);
        } else {
          setProjects((data ?? []) as Project[]);
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // ============================================
  // IMAGE PREVIEW
  // ============================================

  // ============================================
  // IMAGE SELECTION
  // ============================================

  function handleImageChange(file: File | undefined) {
    if (!file) return;

    setError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        "Invalid image format. Use JPG, PNG, WEBP or GIF."
      );
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl("");

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };

    reader.onerror = () => {
      setError("Unable to preview the selected image.");
    };

    reader.readAsDataURL(file);
  }

  // ============================================
  // REMOVE IMAGE FROM FORM
  // ============================================

  function removeSelectedImage() {
    setSelectedImage(null);
    setPreviewUrl("");

    setForm((current) => ({
      ...current,
      image_url: "",
    }));
  }

  // ============================================
  // OPEN ADD FORM
  // ============================================

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setPreviewUrl("");

    setError("");
    setSuccess("");

    setShowForm(true);
  }

  // ============================================
  // OPEN EDIT FORM
  // ============================================

  function openEditForm(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      description: project.description ?? "",
      category: project.category ?? "",
      tech_stack: (project.tech_stack ?? []).join(", "),
      image_url: project.image_url ?? "",
      live_url: project.live_url ?? "",
      github_url: project.github_url ?? "",
    });

    setSelectedImage(null);
    setPreviewUrl("");

    setError("");
    setSuccess("");

    setShowForm(true);
  }

  // ============================================
  // CLOSE FORM
  // ============================================

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setPreviewUrl("");
  }

  // ============================================
  // SAVE PROJECT + IMAGE UPLOAD
  // ============================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    let uploadedPath: string | null = null;

    const oldImageUrl = form.image_url.trim() || null;

    try {
      let imageUrl = oldImageUrl;

      // 1. Upload selected image
      if (selectedImage) {
        const safeFileName = selectedImage.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        );

        const filePath = `projects/${crypto.randomUUID()}-${safeFileName}`;

        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, selectedImage, {
              cacheControl: "3600",
              contentType: selectedImage.type,
              upsert: false,
            });

        if (uploadError) {
          throw new Error(
            `Image upload failed: ${uploadError.message}`
          );
        }

        uploadedPath = uploadData.path;

        // 2. Generate public image URL
        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;
      }

      // 3. Prepare database data
      const projectData = {
        title: form.title.trim(),

        description:
          form.description.trim() || null,

        category:
          form.category.trim() || null,

        tech_stack: form.tech_stack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        image_url: imageUrl,

        live_url:
          form.live_url.trim() || null,

        github_url:
          form.github_url.trim() || null,
      };

      // 4. Insert or update
      const result = editingId
        ? await supabase
            .from("projects")
            .update(projectData)
            .eq("id", editingId)
        : await supabase
            .from("projects")
            .insert(projectData);

      if (result.error) {
        throw new Error(result.error.message);
      }

      // 5. Remove previous Storage image
      // Only after the database update succeeds.
      if (
        editingId &&
        oldImageUrl &&
        oldImageUrl !== imageUrl
      ) {
        const oldPath = getStorageImagePath(oldImageUrl);

        if (oldPath) {
          const { error: cleanupError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([oldPath]);

          if (cleanupError) {
            console.error(
              "Old image cleanup failed:",
              cleanupError.message
            );
          }
        }
      }

      // 6. Success
      setSuccess(
        editingId
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      setSelectedImage(null);
    setPreviewUrl("");

      await loadProjects();

      closeForm();

      router.refresh();
    } catch (err) {
      // Remove newly uploaded image if saving failed
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([uploadedPath]);

        if (cleanupError) {
          console.error(
            "Uploaded image cleanup failed:",
            cleanupError.message
          );
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================
  // DELETE PROJECT
  // ============================================

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    setDeletingId(project.id);
    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      // Remove project image from Storage
      const imagePath = getStorageImagePath(project.image_url);

      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([imagePath]);

        if (storageError) {
          console.error(
            "Project image cleanup failed:",
            storageError.message
          );
        }
      }

      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );

      setSuccess("Project deleted successfully!");

      router.refresh();
    }

    setDeletingId(null);
  }

  // ============================================
  // SEARCH
  // ============================================

  const filteredProjects = projects.filter((project) => {
    const term = search.toLowerCase();

    return (
      project.title.toLowerCase().includes(term) ||
      (project.category ?? "").toLowerCase().includes(term) ||
      (project.tech_stack ?? []).some((tech) =>
        tech.toLowerCase().includes(term)
      )
    );
  });

  // ============================================
  // UI
  // ============================================

  return (
    <main className="min-h-screen bg-[#070A0F] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-300 transition hover:bg-white/10"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Cyber Abilash / Admin
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Projects Management
              </h1>
            </div>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-xl bg-[#00E5A0] px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
          >
            <Plus size={19} />
            Add Project
          </button>
        </header>

        {/* MESSAGES */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* STATISTICS */}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#101827] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Total Projects
              </p>
              <FolderKanban className="text-emerald-400" />
            </div>

            <p className="mt-4 text-3xl font-bold">
              {projects.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101827] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Categories
              </p>
              <Code2 className="text-cyan-400" />
            </div>

            <p className="mt-4 text-3xl font-bold">
              {
                new Set(
                  projects
                    .map((project) => project.category)
                    .filter(Boolean)
                ).size
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101827] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                With Live Demo
              </p>
              <ExternalLink className="text-purple-400" />
            </div>

            <p className="mt-4 text-3xl font-bold">
              {projects.filter((project) => project.live_url).length}
            </p>
          </div>
        </section>

        {/* SEARCH */}

        <section className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#101827] px-4 py-3">
            <Search size={19} className="text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, categories or technologies..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <button
            onClick={() => void loadProjects()}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-[#101827] p-3 text-gray-300 hover:bg-white/10"
            aria-label="Refresh projects"
          >
            <RefreshCw
              size={19}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </section>

        {/* PROJECT LIST */}

        {loading ? (
          <div className="flex min-h-60 items-center justify-center gap-3 text-emerald-400">
            <Loader2 className="animate-spin" />
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#101827]/50 px-5 py-16 text-center">
            <FolderKanban
              className="mx-auto mb-4 text-gray-500"
              size={42}
            />

            <h2 className="text-xl font-semibold">
              {search ? "No matching projects" : "No projects yet"}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {search
                ? "Try another search term."
                : "Add your first project to get started."}
            </p>

            {!search && (
              <button
                onClick={openAddForm}
                className="mt-6 rounded-xl bg-[#00E5A0] px-5 py-3 font-semibold text-black"
              >
                <Plus className="mr-2 inline" size={18} />
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#101827] transition hover:border-emerald-400/40"
              >
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[#0B111C]">
                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon
                      size={42}
                      className="text-gray-600"
                    />
                  )}

                  {project.category && (
                    <span className="absolute left-3 top-3 rounded-full border border-emerald-400/20 bg-black/70 px-3 py-1 text-xs text-emerald-300">
                      {project.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-bold">
                    {project.title}
                  </h2>

                  <p className="mt-2 min-h-10 text-sm leading-6 text-gray-400">
                    {project.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.tech_stack ?? []).map(
                      (tech, index) => (
                        <span
                          key={`${tech}-${index}`}
                          className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                          aria-label="GitHub"
                        >
                          <GitBranch size={19} />
                        </a>
                      )}

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live Demo"
    >
      <ExternalLink size={19} />
    </a>
  )}
</div>

<div className="flex items-center gap-2">
  <button
    onClick={() => openEditForm(project)}
    className="rounded-lg border border-white/10 p-2 text-gray-300 transition hover:border-emerald-400 hover:text-emerald-400"
    aria-label="Edit project"
  >
    <Pencil size={17} />
  </button>

  <button
    onClick={() => void handleDelete(project)}
    disabled={deletingId === project.id}
    className="rounded-lg border border-white/10 p-2 text-gray-300 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
    aria-label="Delete project"
  >
    {deletingId === project.id ? (
      <Loader2 size={17} className="animate-spin" />
    ) : (
      <Trash2 size={17} />
    )}
  </button>
</div>
</div>
</div>
</article>
))}
</section>
)}

{/* ADD / EDIT MODAL */}

{showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
    <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101827] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {editingId ? "Edit Project" : "Add New Project"}
        </h2>

        <button
          onClick={closeForm}
          className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Project Title *
          </label>
          <input
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-[#070A0F] px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Enter project title"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-[#070A0F] px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Describe your project"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Category
          </label>
          <input
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-[#070A0F] px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Web Development"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Technologies (comma separated)
          </label>
          <input
            value={form.tech_stack}
            onChange={(e) =>
              setForm({ ...form, tech_stack: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-[#070A0F] px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Next.js, React, Supabase"
          />
        </div>

        {/* IMAGE UPLOAD */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Project Image
          </label>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-[#070A0F] p-5 text-sm text-gray-300 transition hover:border-emerald-400">
            <Upload size={19} />
            Choose Image (JPG, PNG, WEBP, GIF — Max 5 MB)

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) =>
                handleImageChange(e.target.files?.[0])
              }
            />
          </label>

          {(previewUrl || form.image_url) && (
            <div className="relative mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl || form.image_url}
                alt="Project preview"
                className="h-48 w-full rounded-xl object-cover"
              />

              <button
                type="button"
                onClick={removeSelectedImage}
                className="absolute right-2 top-2 rounded-lg bg-red-500 p-2 text-white"
              >
                <X size={17} />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Live Demo URL
          </label>
          <input
            type="url"
            value={form.live_url}
            onChange={(e) =>
              setForm({ ...form, live_url: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-[#070A0F] px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            GitHub URL
          </label>
          <input
            type="url"
            value={form.github_url}
            onChange={(e) =>
              setForm({ ...form, github_url: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-[#070A0F] px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="https://github.com/username/project"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={closeForm}
            className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#00E5A0] px-5 py-3 font-semibold text-black transition hover:bg-emerald-300 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {editingId ? "Update Project" : "Save Project"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>
</main>
);
}