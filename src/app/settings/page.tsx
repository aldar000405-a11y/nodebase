"use client";

import { useSession } from "next-auth/react";

const SYSTEM_LOGS = [
  { time: "12:04:11", message: "AUTH_GRANTED: ADMIN", tone: "success" },
  { time: "12:04:12", message: "CACHE_FLUSH_SUCCESS", tone: "success" },
  { time: "12:04:19", message: "UPDATING_OPERATOR_TABLE...", tone: "muted" },
  { time: "12:05:00", message: "IDLE_HEARTBEAT_STABLE", tone: "muted" },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <p
          className="text-[10px] uppercase tracking-[0.25em] text-[#AAAAAA]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          LOADING_SYSTEM...
        </p>
      </div>
    );
  }

  const email = session?.user?.email ?? "operator@monolith.ai";
  const name = session?.user?.name ?? "OPERATOR_01";
  const userInitial = name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] px-6 py-10 text-white md:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 border-l-4 border-[#7B2FFF] pl-6">
          <h1
            className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SYSTEM_CONFIG <span className="text-[#7B2FFF]">V.04</span>
          </h1>
          <p
            className="mt-3 text-[10px] uppercase tracking-[0.35em] text-[#AAAAAA]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            CORE_MODULE | OPERATOR_IDENTITY_PRESET
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="relative border border-[#333333] bg-[#0D0D0D] p-6 lg:col-span-8 rounded-none">
            <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[#7B2FFF]" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[#7B2FFF]" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#7B2FFF]" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#7B2FFF]" />

            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <div className="relative h-32 w-32 shrink-0 border border-[#333333] bg-[#0A0A0A] rounded-none">
                <div
                  className="flex h-full w-full items-center justify-center text-5xl font-black text-[#7B2FFF]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {userInitial}
                </div>
                <div className="absolute bottom-2 right-2 border border-[#333333] bg-[#0D0D0D] px-2 py-1">
                  <p
                    className="text-[9px] uppercase tracking-[0.2em] text-[#AAAAAA]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    OP_ID_404
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <label
                    htmlFor="display-name"
                    className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#AAAAAA]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    DISPLAY_NAME
                  </label>
                  <input
                    id="display-name"
                    type="text"
                    defaultValue={name}
                    className="bg-[#0A0A0A] border border-[#333333] p-3 w-full rounded-none text-white focus:border-[#7B2FFF] focus:outline-none placeholder-[#555555]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    placeholder="OPERATOR_X_01"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email-address"
                    className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#AAAAAA]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    EMAIL_ADDRESS
                  </label>
                  <input
                    id="email-address"
                    type="text"
                    value={email}
                    readOnly
                    className="bg-[#0A0A0A] border border-[#333333] p-3 w-full rounded-none text-white focus:border-[#7B2FFF] focus:outline-none placeholder-[#555555] cursor-not-allowed"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="rounded-none bg-[#7B2FFF] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#6A1FEE]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    SAVE SYSTEM CHANGES
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <section className="border border-[#333333] bg-[#0D0D0D] p-5 rounded-none">
              <h3
                className="mb-4 text-[11px] uppercase tracking-[0.25em] text-[#7B2FFF]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                SYSTEM_LOGS
              </h3>
              <div className="space-y-3">
                {SYSTEM_LOGS.map((log) => (
                  <div
                    key={`${log.time}-${log.message}`}
                    className="flex gap-3"
                  >
                    <span
                      className="shrink-0 text-[10px] text-[#888888]"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {log.time}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-[0.08em] ${
                        log.tone === "success"
                          ? "text-[#00FF88]"
                          : "text-[#AAAAAA]"
                      }`}
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-[#FF3B3B] bg-[#0D0D0D] p-4 rounded-none">
              <h4
                className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[#FF3B3B]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                SECURITY_ALERT
              </h4>
              <p
                className="text-[11px] uppercase leading-relaxed text-[#FF3B3B]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                THREE UNAUTHORIZED ATTEMPTS DETECTED FROM LOCAL TERMINAL_04.
                IDENTITY VERIFICATION REQUIRED ON NEXT CYCLE.
              </p>
            </section>
          </aside>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="border border-[#333333] bg-[#0D0D0D] p-6 rounded-none">
            <p
              className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#7B2FFF]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              ENCRYPTION_STATUS
            </p>
            <p
              className="text-5xl font-black tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              AES_256
            </p>
          </section>

          <section className="border border-[#333333] bg-[#0D0D0D] p-6 rounded-none">
            <p
              className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#7B2FFF]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              LAST_SYNC_LATENCY
            </p>
            <p
              className="text-5xl font-black tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              0.04 MS
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
