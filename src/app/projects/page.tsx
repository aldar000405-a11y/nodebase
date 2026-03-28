"use client";

import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronsUpDown,
  Clock,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  Lightbulb,
  List,
  MoreHorizontal,
  PanelLeftClose,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type ComponentType, useEffect, useMemo, useState } from "react";

type ProjectStatus = "PROTOTYPE_READY" | "IN_PROGRESS" | "DRAFT";
type ViewMode = "grid" | "list";
type SortOption =
  | "LAST_MODIFIED_DESC"
  | "LAST_MODIFIED_ASC"
  | "NAME_ASC"
  | "NAME_DESC";

type DashboardProject = {
  id: string;
  name: string;
  type: string;
  status: ProjectStatus;
  completionPercentage: number;
  createdAt: string;
  createdAtMs: number;
};

type DatabaseProject = {
  id: string;
  name: string;
  platform: string;
  status: string;
  healthScore: number;
  createdAt: string | Date;
};

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/projects",
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/executions", label: "Executions", icon: Play },
  { href: "/projects", label: "Templates", icon: FileText },
  { href: "/projects", label: "Analytics", icon: BarChart3 },
  { href: "/projects", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

const QUICK_ITEMS = [
  { label: "New from Template", icon: Zap },
  { label: "Recent Activity", icon: Clock },
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "LAST_MODIFIED_DESC", label: "Last modified" },
  { value: "LAST_MODIFIED_ASC", label: "Oldest first" },
  { value: "NAME_ASC", label: "Name A-Z" },
  { value: "NAME_DESC", label: "Name Z-A" },
];

const STATUS_META: Record<ProjectStatus, { label: string; className: string }> =
  {
    PROTOTYPE_READY: {
      label: "Completed",
      className:
        "bg-[oklch(0.696_0.17_162.48_/15%)] text-[oklch(0.696_0.17_162.48)]",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className:
        "bg-[oklch(0.488_0.243_264.376_/15%)] text-[oklch(0.488_0.243_264.376)]",
    },
    DRAFT: {
      label: "Draft",
      className: "bg-[oklch(0.708_0_0_/15%)] text-[oklch(0.708_0_0)]",
    },
  };

const PREVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1697292866717-0b20bd310268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "https://images.unsplash.com/photo-1642132652806-8aa09801c2ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "https://images.unsplash.com/photo-1648134859177-66e35b61e106?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
];

function mapStatus(status: string): ProjectStatus {
  if (status === "COMPLETED") return "PROTOTYPE_READY";
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  return "DRAFT";
}

function toProjectDateInfo(dateValue: string | Date): {
  label: string;
  timestamp: number;
} {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return { label: "Unknown date", timestamp: 0 };
  }

  return {
    label: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timestamp: date.getTime(),
  };
}

function mapProjectFromDatabase(project: DatabaseProject): DashboardProject {
  const createdAt = toProjectDateInfo(project.createdAt);

  return {
    id: project.id,
    name: project.name,
    type: project.platform.replaceAll("_", " "),
    status: mapStatus(project.status),
    completionPercentage: Math.max(0, Math.min(100, project.healthScore ?? 0)),
    createdAt: createdAt.label,
    createdAtMs: createdAt.timestamp,
  };
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [deletingProjectIds, setDeletingProjectIds] = useState<
    Record<string, boolean>
  >({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("LAST_MODIFIED_DESC");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [confirmDeleteProject, setConfirmDeleteProject] =
    useState<DashboardProject | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const json = (await response.json()) as { items?: DatabaseProject[] };
        if (!isMounted || !Array.isArray(json.items)) return;
        setProjects(json.items.map(mapProjectFromDatabase));
      } catch (error) {
        console.error("LOAD_PROJECTS_FAILED", error);
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("[data-project-menu]")) {
        setOpenMenuId(null);
      }
      if (!target.closest("[data-sort-menu]")) {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!confirmDeleteProject) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setConfirmDeleteProject(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmDeleteProject]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(q) ||
        project.type.toLowerCase().includes(q) ||
        STATUS_META[project.status].label.toLowerCase().includes(q)
      );
    });
  }, [projects, searchQuery]);

  const sortedProjects = useMemo(() => {
    const next = [...filteredProjects];

    switch (sortBy) {
      case "LAST_MODIFIED_ASC":
        next.sort((a, b) => a.createdAtMs - b.createdAtMs);
        break;
      case "NAME_ASC":
        next.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "NAME_DESC":
        next.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        next.sort((a, b) => b.createdAtMs - a.createdAtMs);
    }

    return next;
  }, [filteredProjects, sortBy]);

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label ??
    "Last modified";

  const displayName = session?.user?.name?.trim() || "Operator";
  const email = session?.user?.email || "operator@monolith.ai";
  const firstName = displayName.split(" ")[0] || "Operator";
  const initials = displayName
    .split(" ")
    .map((chunk) => chunk.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleDeleteProject = async (projectId: string) => {
    if (deletingProjectIds[projectId]) return;

    setDeletingProjectIds((prev) => ({ ...prev, [projectId]: true }));

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) return;

      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setOpenMenuId(null);
    } finally {
      setDeletingProjectIds((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
    }
  };

  const handleCreateProject = () => {};

  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)] text-[oklch(0.985_0_0)]">
      <div className="min-h-screen border-x border-[oklch(1_0_0_/10%)]">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <aside
            className={`w-full border-b border-[oklch(1_0_0_/10%)] bg-[oklch(0.175_0_0)] transition-[width] duration-200 lg:border-b-0 lg:border-r ${isSidebarCollapsed ? "lg:w-[72px]" : "lg:w-[224px]"}`}
          >
            <div
              className={`flex items-center border-b border-[oklch(1_0_0_/10%)] py-4 ${isSidebarCollapsed ? "justify-center px-2" : "justify-between px-5"}`}
            >
              <div
                className={`items-center ${isSidebarCollapsed ? "hidden" : "flex"}`}
              >
                <span className="text-[22px] font-bold tracking-[-0.5px]">
                  MONOLITH
                </span>
                <span className="text-[22px] font-bold tracking-[-0.5px] text-[oklch(0.488_0.243_264.376)]">
                  _AI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="rounded-md p-1 text-[oklch(0.708_0_0)] hover:bg-[oklch(0.269_0_0)]"
              >
                <PanelLeftClose
                  className={`size-4 transition-transform duration-200 ${isSidebarCollapsed ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>

            <div className="space-y-0.5 p-3">
              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.active;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center rounded-md px-2 py-1.5 text-[12px] ${isSidebarCollapsed ? "justify-center" : "gap-1.5"} ${
                      isActive
                        ? "bg-[oklch(0.488_0.243_264.376_/12%)] text-[oklch(0.985_0_0)]"
                        : "text-[oklch(0.708_0_0)] hover:bg-[oklch(0.269_0_0)]"
                    }`}
                  >
                    <Icon
                      className={`size-4 ${isActive ? "text-[oklch(0.488_0.243_264.376)]" : "text-[oklch(0.708_0_0)]"}`}
                    />
                    {isSidebarCollapsed ? null : <span>{item.label}</span>}
                    {index === 1 && !isSidebarCollapsed ? (
                      <span className="ml-auto rounded-full bg-[oklch(0.269_0_0)] px-1.5 py-0.5 text-[10px] font-semibold text-[oklch(0.708_0_0)]">
                        {projects.length}
                      </span>
                    ) : null}
                  </Link>
                );
              })}

              <div className="my-2.5 h-px bg-[oklch(1_0_0_/10%)]" />
              <p
                className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-[oklch(0.556_0_0)] ${isSidebarCollapsed ? "hidden" : "block"}`}
              >
                Quick Actions
              </p>

              {QUICK_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={`flex w-full items-center rounded-md px-2 py-1.5 text-[12px] text-[oklch(0.708_0_0)] hover:bg-[oklch(0.269_0_0)] ${isSidebarCollapsed ? "justify-center" : "gap-1.5 text-left"}`}
                  >
                    <Icon className="size-4" />
                    {isSidebarCollapsed ? null : <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto border-t border-[oklch(1_0_0_/10%)] px-3.5 py-3">
              <div
                className={`mb-2 items-center gap-1.5 text-[12px] text-[oklch(0.708_0_0)] ${isSidebarCollapsed ? "hidden" : "flex"}`}
              >
                <HelpCircle className="size-4" />
                <span>Help and Docs</span>
              </div>

              <div
                className={`mb-2.5 items-center gap-1.5 rounded-lg bg-[oklch(0.269_0_0)] px-2.5 py-1.5 text-[12px] text-[oklch(0.985_0_0)] ${isSidebarCollapsed ? "hidden" : "flex"}`}
              >
                <Sparkles className="size-4 text-[oklch(0.627_0.265_303.9)]" />
                <span>What&apos;s New</span>
                <span className="ml-auto size-2 rounded-full bg-[oklch(0.488_0.243_264.376)]" />
              </div>

              <div
                className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-1.5"}`}
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] text-[10px] font-semibold">
                  {initials || "OP"}
                </div>
                <div
                  className={`min-w-0 flex-1 ${isSidebarCollapsed ? "hidden" : "block"}`}
                >
                  <p className="truncate text-[12px] text-[oklch(0.985_0_0)]">
                    {displayName}
                  </p>
                  <p className="truncate text-[11px] text-[oklch(0.556_0_0)]">
                    {email}
                  </p>
                </div>
                {isSidebarCollapsed ? null : (
                  <ChevronsUpDown className="size-4 text-[oklch(0.556_0_0)]" />
                )}
              </div>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col bg-[oklch(0.145_0_0)]">
            <nav className="flex h-14 items-center justify-between border-b border-[oklch(1_0_0_/10%)] bg-[oklch(0.175_0_0)] px-5">
              <div className="relative w-[320px] max-w-full">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[oklch(0.708_0_0)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search projects..."
                  className="h-[34px] w-full rounded-md border border-[oklch(1_0_0_/10%)] bg-[oklch(0.205_0_0)] pl-8 pr-3 text-[11px] text-[oklch(0.985_0_0)] placeholder:text-[oklch(0.708_0_0)] focus:outline-none"
                />
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  className="relative text-[oklch(0.708_0_0)]"
                >
                  <Bell className="size-4" />
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-[oklch(0.175_0_0)] bg-[oklch(0.488_0.243_264.376)]" />
                </button>
                <Settings className="size-4 text-[oklch(0.708_0_0)]" />
                <div className="h-5 w-px bg-[oklch(1_0_0_/10%)]" />
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] text-[10px] font-semibold">
                    {initials || "OP"}
                  </div>
                  <span className="text-[11px] font-medium text-[oklch(0.985_0_0)]">
                    {firstName}
                  </span>
                  <ChevronDown className="size-3 text-[oklch(0.708_0_0)]" />
                </div>
              </div>
            </nav>

            <div className="px-5 pb-5 pt-4">
              <div className="flex flex-col items-start justify-between gap-2.5 lg:flex-row lg:items-end">
                <div>
                  <h1 className="text-[20px] font-semibold text-[oklch(0.985_0_0)]">
                    Good evening, {firstName}
                  </h1>
                  <p className="mt-1 text-[12px] text-[oklch(0.708_0_0)]">
                    {projects.length > 0
                      ? `You have ${projects.length} project${projects.length === 1 ? "" : "s"}`
                      : "You have no projects yet"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex overflow-hidden rounded-md border border-[oklch(1_0_0_/10%)] bg-[oklch(0.205_0_0)]">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`px-1.5 py-1 ${viewMode === "grid" ? "bg-[oklch(0.269_0_0)] text-[oklch(0.985_0_0)]" : "text-[oklch(0.708_0_0)]"}`}
                    >
                      <LayoutGrid className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`px-1.5 py-1 ${viewMode === "list" ? "bg-[oklch(0.269_0_0)] text-[oklch(0.985_0_0)]" : "text-[oklch(0.708_0_0)]"}`}
                    >
                      <List className="size-4" />
                    </button>
                  </div>

                  <div className="relative" data-sort-menu>
                    <button
                      type="button"
                      onClick={() => setIsSortMenuOpen((prev) => !prev)}
                      className="inline-flex items-center gap-1 rounded-md border border-[oklch(1_0_0_/10%)] px-2.5 py-1 text-[11px] text-[oklch(0.708_0_0)]"
                    >
                      {activeSortLabel}
                      <ChevronDown className="size-3.5" />
                    </button>

                    {isSortMenuOpen ? (
                      <div className="animate-in fade-in zoom-in-95 absolute right-0 top-8 z-50 w-[152px] origin-top overflow-hidden rounded-md border border-[oklch(1_0_0_/10%)] bg-[oklch(0.205_0_0)] p-1 shadow-[0_8px_24px_oklch(0_0_0_/38%)]">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSortBy(option.value);
                              setIsSortMenuOpen(false);
                            }}
                            className={`flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[11px] ${sortBy === option.value ? "bg-[oklch(0.269_0_0)] text-[oklch(0.985_0_0)]" : "text-[oklch(0.985_0_0_/80%)] hover:bg-[oklch(0.269_0_0)]"}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateProject}
                    disabled
                    className="inline-flex items-center gap-1 rounded-md bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] px-4 py-2 text-[11px] font-medium text-[oklch(0.985_0_0)] shadow-[0_0_18px_oklch(0.488_0.243_264.376_/20%)] cursor-not-allowed opacity-50"
                  >
                    <Plus className="size-3.5" />
                    New Project
                  </button>
                </div>
              </div>

              {sortedProjects.length === 0 ? (
                searchQuery.trim().length > 0 && projects.length > 0 ? (
                  <div className="mt-7 rounded-lg border border-[oklch(1_0_0_/10%)] bg-[oklch(0.205_0_0)] px-5 py-10 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] border border-[oklch(0.488_0.243_264.376_/40%)] bg-[oklch(0.488_0.243_264.376_/10%)] rotate-45">
                      <Search className="size-5 -rotate-45 text-[oklch(0.627_0.265_303.9)]" />
                    </div>
                    <h2 className="text-[22px] font-semibold text-[oklch(0.985_0_0)]">
                      No project found
                    </h2>
                    <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-[1.55] text-[oklch(0.708_0_0)]">
                      We couldn&apos;t find a project matching
                      <span className="mx-1 rounded-md bg-[oklch(0.269_0_0)] px-1.5 py-0.5 text-[oklch(0.985_0_0)]">
                        "{searchQuery.trim()}"
                      </span>
                      . Try another name or clear the search to see all
                      projects.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] px-5 py-2 text-[12px] font-semibold text-[oklch(0.985_0_0)] shadow-[0_0_20px_oklch(0.488_0.243_264.376_/20%)]"
                      >
                        <Search className="size-3.5" />
                        Clear Search
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateProject}
                    disabled
                    className="inline-flex items-center gap-1.5 rounded-md border border-[oklch(1_0_0_/12%)] px-4 py-2 text-[12px] text-[oklch(0.985_0_0_/90%)] hover:bg-[oklch(0.269_0_0)] cursor-not-allowed opacity-50"
                      >
                        <Plus className="size-3.5" />
                        Create New Project
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-7 rounded-lg border border-[oklch(1_0_0_/10%)] bg-[oklch(0.205_0_0)] px-5 py-11 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[oklch(0.488_0.243_264.376_/45%)] bg-[oklch(0.488_0.243_264.376_/10%)]">
                      <Sparkles className="size-6 text-[oklch(0.627_0.265_303.9)]" />
                    </div>
                    <h2 className="text-[24px] font-semibold">
                      Start your first project
                    </h2>
                    <p className="mx-auto mt-2.5 max-w-[390px] text-[13px] leading-[1.55] text-[oklch(0.708_0_0)]">
                      Fill in your UX research data and let AI generate a visual
                      prototype in real time.
                    </p>
                    <button
                      type="button"
                      onClick={handleCreateProject}
                    disabled
                    className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] px-6 py-2.5 text-[13px] font-semibold shadow-[0_0_24px_oklch(0.488_0.243_264.376_/22%)] cursor-not-allowed opacity-50"
                    >
                      <Plus className="size-4" />
                      Create New Project
                    </button>
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[oklch(0.708_0_0)]">
                        <Lightbulb className="size-3.5 text-[oklch(0.488_0.243_264.376)]" />
                        11-step UX research
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[oklch(0.708_0_0)]">
                        <Wand2 className="size-3.5 text-[oklch(0.488_0.243_264.376)]" />
                        AI-generated prototypes
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[oklch(0.708_0_0)]">
                        <RefreshCw className="size-3.5 text-[oklch(0.488_0.243_264.376)]" />
                        Rapid iteration
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <>
                  <div
                    key={viewMode}
                    className={`animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ${
                      viewMode === "grid"
                        ? "mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3"
                        : "mt-4 grid grid-cols-1 gap-3"
                    }`}
                  >
                    {sortedProjects.map((project, index) => {
                      const status = STATUS_META[project.status];
                      const menuOpen = openMenuId === project.id;
                      const deleting = deletingProjectIds[project.id] === true;

                      return (
                        <article
                          key={project.id}
                          className={`group relative overflow-visible rounded-md border border-[oklch(1_0_0_/10%)] bg-[oklch(0.205_0_0)] animate-in fade-in zoom-in-95 transition-all duration-200 hover:-translate-y-0.5 hover:border-[oklch(0.488_0.243_264.376_/40%)] ${
                            menuOpen ? "z-50" : "z-0"
                          } ${viewMode === "list" ? "grid grid-cols-[220px_minmax(0,1fr)]" : ""}`}
                        >
                          <div
                            className={`relative overflow-hidden ${
                              viewMode === "list"
                                ? "h-full min-h-[128px] rounded-l-md"
                                : "aspect-[16/10] rounded-t-md"
                            }`}
                          >
                            <Image
                              alt={`${project.name} preview`}
                              className="h-full w-full object-cover"
                              fill
                              src={
                                PREVIEW_IMAGES[index % PREVIEW_IMAGES.length]
                              }
                              style={{
                                filter: "brightness(0.7) saturate(0.8)",
                              }}
                            />
                            <div className="absolute left-2 top-2 z-10">
                              <span
                                className={`inline-block rounded-[20px] px-1.5 py-0.5 text-[9px] font-semibold ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </div>
                            <div className="absolute bottom-2 right-2 z-10 rounded-md border border-[oklch(1_0_0_/18%)] bg-[oklch(0.145_0_0_/72%)] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[oklch(0.985_0_0)]">
                              {project.type}
                            </div>
                          </div>

                          <div
                            className={`flex items-center justify-between ${
                              viewMode === "list" ? "p-3" : "p-2.5"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-semibold text-[oklch(0.985_0_0)]">
                                {project.name}
                              </p>
                              <p className="mt-0.5 text-[10px] text-[oklch(0.708_0_0)]">
                                Modified {project.createdAt}
                              </p>
                            </div>

                            <div className="relative" data-project-menu>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setOpenMenuId((prev) =>
                                    prev === project.id ? null : project.id,
                                  );
                                }}
                                className="rounded-md p-0.5 text-[oklch(0.708_0_0)]"
                              >
                                <MoreHorizontal className="size-4" />
                              </button>

                              {menuOpen ? (
                                <div className="animate-in fade-in zoom-in-95 absolute right-0 top-7 z-[70] w-[164px] origin-top overflow-hidden rounded-md border border-[oklch(1_0_0_/10%)] bg-[oklch(0.205_0_0)] p-1 shadow-[0_8px_32px_oklch(0_0_0_/40%)]">
                                  <button
                                    type="button"
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-[12px] text-[oklch(0.985_0_0_/80%)] hover:bg-[oklch(0.269_0_0)]"
                                  >
                                    <RefreshCw className="size-3.5" />
                                    Redesign
                                  </button>
                                  <button
                                    type="button"
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-[12px] text-[oklch(0.985_0_0_/80%)] hover:bg-[oklch(0.269_0_0)]"
                                  >
                                    <BarChart3 className="size-3.5" />
                                    Insights
                                  </button>
                                  <div className="my-0.5 h-px bg-[oklch(1_0_0_/10%)]" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConfirmDeleteProject(project);
                                      setOpenMenuId(null);
                                    }}
                                    disabled={deleting}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-[12px] text-[oklch(0.704_0.191_22.216)] hover:bg-[oklch(0.704_0.191_22.216_/10%)]"
                                  >
                                    <Trash2 className="size-3.5" />
                                    {deleting ? "Deleting..." : "Delete"}
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between px-0 pb-2 pt-4">
                    <div className="flex items-center gap-2 text-[12px] text-[oklch(0.708_0_0)]">
                      <Trash2 className="size-3.5" />
                      Trash (0 items)
                    </div>
                    <span className="text-xs text-[oklch(0.556_0_0)]">
                      {sortedProjects.length} of {projects.length} projects
                      shown
                    </span>
                  </div>
                </>
              )}
            </div>
            {confirmDeleteProject ? (
              <div className="animate-in fade-in-0 fixed inset-0 z-[90] flex items-center justify-center bg-[oklch(0_0_0_/55%)] px-4 backdrop-blur-[2px]">
                <div className="animate-in zoom-in-95 fade-in-0 relative w-[min(92vw,420px)] rounded-xl border border-[oklch(1_0_0_/12%)] bg-[oklch(0.205_0_0)] p-5 shadow-[0_16px_48px_oklch(0_0_0_/50%)]">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteProject(null)}
                    className="absolute right-3 top-3 rounded-md p-1 text-[oklch(0.708_0_0)] hover:bg-[oklch(0.269_0_0)]"
                  >
                    <X className="size-4" />
                  </button>

                  <h3 className="text-[18px] font-semibold text-[oklch(0.985_0_0)]">
                    Delete project?
                  </h3>
                  <p className="mt-2 text-[12px] leading-5 text-[oklch(0.708_0_0)]">
                    This action will permanently delete
                    <span className="mx-1 rounded-md bg-[oklch(0.269_0_0)] px-1.5 py-0.5 text-[oklch(0.985_0_0)]">
                      {confirmDeleteProject.name}
                    </span>
                    and cannot be undone.
                  </p>

                  <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteProject(null)}
                      className="rounded-md border border-[oklch(1_0_0_/12%)] px-3 py-1.5 text-[12px] text-[oklch(0.985_0_0_/90%)] hover:bg-[oklch(0.269_0_0)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const id = confirmDeleteProject.id;
                        await handleDeleteProject(id);
                        setConfirmDeleteProject(null);
                      }}
                      disabled={
                        deletingProjectIds[confirmDeleteProject.id] === true
                      }
                      className="rounded-md bg-[oklch(0.704_0.191_22.216)] px-3 py-1.5 text-[12px] font-semibold text-[oklch(0.985_0_0)] hover:bg-[oklch(0.646_0.204_26.965)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingProjectIds[confirmDeleteProject.id] === true
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
