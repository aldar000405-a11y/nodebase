"use client";

import { Activity } from "lucide-react";
import Link from "next/link";

export default function ExecutionsPage() {
  return (
    <div
      className="flex min-h-screen w-full 
    items-center justify-center bg-[#0D0D0D]"
    >
      <div className="flex flex-col items-center gap-4">
        <Activity className="h-12 w-12 text-[#7B2FFF]" />
        <p
          className="text-[13px] font-bold uppercase 
        tracking-[0.3em] text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          EXECUTIONS
        </p>
        <p
          className="text-[11px] text-[#666666]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          COMING_SOON — Available after AI engine is built.
        </p>
        <Link
          href="/projects"
          className="mt-4 text-[10px] text-[#7B2FFF] 
          hover:underline uppercase tracking-[0.2em]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          ← BACK_TO_PROJECTS
        </Link>
      </div>
    </div>
  );
}
