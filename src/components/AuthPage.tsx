"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Clock,
  Github,
  Grid3X3,
  Hexagon,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AuthPageProps = {
  mode?: "register" | "login";
};

type AuthAction =
  | "idle"
  | "send-code"
  | "verify-otp"
  | "social-google"
  | "social-github";

const STRICT_EMAIL_REGEX =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const OTP_REGEX = /^\d{6}$/;
const OTP_SLOTS = [
  "slot-a",
  "slot-b",
  "slot-c",
  "slot-d",
  "slot-e",
  "slot-f",
] as const;

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        d="M21.35 11.1H12v2.95h5.35c-.23 1.5-1.7 4.4-5.35 4.4-3.22 0-5.84-2.66-5.84-5.95s2.62-5.95 5.84-5.95c1.83 0 3.05.78 3.75 1.45l2.55-2.48C16.68 3.97 14.53 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.65-3.66 8.65-8.82 0-.59-.07-1.04-.15-1.48z"
        fill="#FFC107"
      />
      <path
        d="M4.04 7.83l2.42 1.78A5.42 5.42 0 0 1 12 6.55c1.83 0 3.05.78 3.75 1.45l2.55-2.48C16.68 3.97 14.53 3 12 3 8.54 3 5.54 4.95 4.04 7.83z"
        fill="#FF3D00"
      />
      <path
        d="M12 21c2.47 0 4.54-.81 6.06-2.2l-2.8-2.3c-.75.52-1.74.88-3.26.88-3.63 0-5.11-2.84-5.37-4.3L4.22 14.9C5.7 18 8.6 21 12 21z"
        fill="#4CAF50"
      />
      <path
        d="M21.35 11.1H12v2.95h5.35c-.11.72-.5 1.78-1.26 2.44l2.8 2.3C20.52 17.2 21.65 14.8 21.65 12.18c0-.59-.07-1.04-.15-1.48z"
        fill="#1976D2"
      />
    </svg>
  );
}

export default function AuthPage({ mode = "register" }: AuthPageProps) {
  const router = useRouter();
  const otpInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const lastSubmittedOtpRef = useRef("");
  const socialTimeoutRef = useRef<number | undefined>(undefined);
  const socialPendingRef = useRef(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [activeAction, setActiveAction] = useState<AuthAction>("idle");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [resendAvailableAt, setResendAvailableAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [socialEnabled, setSocialEnabled] = useState({
    google: true,
    github: true,
  });

  const isRegister = mode === "register";
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const otpChars = useMemo(
    () => Array.from({ length: 6 }, (_, i) => otp[i] ?? ""),
    [otp],
  );

  const isLoading = activeAction !== "idle";
  const isSendingCode = activeAction === "send-code";
  const isVerifyingOtp = activeAction === "verify-otp";
  const isOtpBusy = isSendingCode || isVerifyingOtp;
  const isGoogleBusy = activeAction === "social-google";
  const isGithubBusy = activeAction === "social-github";
  const isEmailAccent = isEmailFocused || normalizedEmail.length > 0;

  const canResend = now >= resendAvailableAt && !isLoading;
  const secondsUntilResend = Math.max(
    0,
    Math.ceil((resendAvailableAt - now) / 1000),
  );
  const hasEmailError = step === 1 && error.toLowerCase().includes("email");
  const hasOtpError =
    step === 2 && error.toLowerCase().includes("invalid code");

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (step === 2) otpInputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hasAuthNoise =
      url.searchParams.has("error") ||
      url.searchParams.has("callbackUrl") ||
      url.searchParams.has("code") ||
      url.searchParams.has("state");

    if (!hasAuthNoise) return;

    url.searchParams.delete("error");
    url.searchParams.delete("callbackUrl");
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    const query = url.searchParams.toString();
    const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);

  useEffect(() => {
    const oauthPendingKey = "auth.oauth.pending";

    const clearSocialTimeout = () => {
      if (socialTimeoutRef.current !== undefined) {
        window.clearTimeout(socialTimeoutRef.current);
        socialTimeoutRef.current = undefined;
      }
    };

    const resetInteractiveState = () => {
      clearSocialTimeout();
      socialPendingRef.current = false;
      setActiveAction("idle");
      setError("");
      setStep(1);
      setOtp("");
      lastSubmittedOtpRef.current = "";
    };

    const focusEmail = () => {
      requestAnimationFrame(() => {
        emailInputRef.current?.focus();
      });
    };

    // On mount: if there is a stale OAuth marker in sessionStorage, the user
    // returned from an OAuth redirect via a *fresh* page load (not bfcache).
    // Clean it up so the page starts in a guaranteed-clean state.
    const staleMarker = window.sessionStorage.getItem(oauthPendingKey);
    if (staleMarker) {
      window.sessionStorage.removeItem(oauthPendingKey);
    }

    const onPageShow = (event: PageTransitionEvent) => {
      // bfcache restore: React's fiber tree is frozen and state-setters
      // inside a pageshow handler may not reliably trigger re-renders.
      // A full reload is the only guaranteed way to get a clean UI.
      if (event.persisted) {
        window.sessionStorage.removeItem(oauthPendingKey);
        window.location.reload();
        return;
      }
      // Non-persisted pageshow (fresh navigation): just reset state.
      window.sessionStorage.removeItem(oauthPendingKey);
      resetInteractiveState();
      focusEmail();
    };

    const onPageHide = () => {
      clearSocialTimeout();
      setActiveAction("idle");
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      // Only reset when returning from an OAuth popup/redirect.
      const hasPendingMarker = Boolean(
        window.sessionStorage.getItem(oauthPendingKey),
      );
      if (!socialPendingRef.current && !hasPendingMarker) return;
      window.sessionStorage.removeItem(oauthPendingKey);
      resetInteractiveState();
      focusEmail();
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    focusEmail();

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearSocialTimeout();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const providers = (await response.json()) as Record<string, unknown>;
        if (!isMounted) return;

        setSocialEnabled({
          google: Boolean(providers.google),
          github: Boolean(providers.github),
        });
      } catch {
        // Keep defaults when provider discovery fails.
      }
    };

    void loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  const getEmailError = (value: string) => {
    if (!value || value.includes(" ") || !STRICT_EMAIL_REGEX.test(value)) {
      return "This email address is not valid. Please check and try again.";
    }
    return "";
  };

  const verifyOtp = useCallback(async () => {
    if (!OTP_REGEX.test(otp)) {
      setError("Invalid code. Please try again.");
      return;
    }

    setError("");
    setActiveAction("verify-otp");

    try {
      const result = await signIn("credentials", {
        email: normalizedEmail,
        otp,
        redirect: false,
        callbackUrl: "/projects",
      });

      if (!result || result.error) {
        setError("Invalid code. Please try again.");
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setActiveAction("idle");
    }
  }, [normalizedEmail, otp, router]);

  useEffect(() => {
    if (step !== 2 || otp.length !== 6 || isVerifyingOtp) return;
    if (lastSubmittedOtpRef.current === otp) return;

    lastSubmittedOtpRef.current = otp;
    void verifyOtp();
  }, [otp, step, isVerifyingOtp, verifyOtp]);

  const handleSocial = async (provider: "google" | "github") => {
    if (!socialEnabled[provider]) {
      setError(
        `${provider === "google" ? "Google" : "GitHub"} sign-in is not configured yet.`,
      );
      return;
    }
    const oauthPendingKey = "auth.oauth.pending";
    window.sessionStorage.setItem(oauthPendingKey, provider);

    setError("");
    setActiveAction(provider === "google" ? "social-google" : "social-github");
    socialPendingRef.current = true;

    let navigatingAway = false;
    let timedOut = false;

    socialTimeoutRef.current = window.setTimeout(() => {
      timedOut = true;
      socialPendingRef.current = false;
      socialTimeoutRef.current = undefined;
      setActiveAction("idle");
      setError(
        `${provider === "google" ? "Google" : "GitHub"} sign-in timed out. Please try again.`,
      );
    }, 12_000);

    try {
      const callbackUrl = `${window.location.origin}/projects`;
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (!result) {
        window.sessionStorage.removeItem(oauthPendingKey);
        setError("Social sign-in failed. Please try again.");
        return;
      }

      if (result.url && !result.url.includes("error=")) {
        if (socialTimeoutRef.current !== undefined) {
          window.clearTimeout(socialTimeoutRef.current);
          socialTimeoutRef.current = undefined;
        }
        navigatingAway = true;
        window.location.assign(result.url);
        return;
      }

      if (result.error) {
        window.sessionStorage.removeItem(oauthPendingKey);
        if (result.error === "OAuthAccountNotLinked") {
          setError(
            "This email is linked to another sign-in method. Use OTP once, then retry Google.",
          );
        } else if (result.error === "AccessDenied") {
          setError("Access was denied by the provider.");
        } else if (result.error === "OAuthSignin") {
          setError("Google connection timed out. Please try again.");
        } else {
          setError("Social sign-in failed. Please try again.");
        }
        return;
      }

      if (result.url?.includes("error=")) {
        window.sessionStorage.removeItem(oauthPendingKey);
        setError("Google connection timed out. Please try again.");
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch {
      window.sessionStorage.removeItem(oauthPendingKey);
      if (!timedOut && !navigatingAway) {
        setError("Social sign-in failed. Please try again.");
      }
    } finally {
      if (socialTimeoutRef.current !== undefined) {
        window.clearTimeout(socialTimeoutRef.current);
        socialTimeoutRef.current = undefined;
      }
      socialPendingRef.current = false;
      setActiveAction("idle");
    }
  };
  const requestOtp = async (fromResend = false) => {
    const invalid = getEmailError(normalizedEmail);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError("");
    setActiveAction("send-code");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?:
          | "FORBIDDEN_ORIGIN"
          | "TOO_MANY_REQUESTS"
          | "INVALID_EMAIL"
          | "WRONG_EMAIL"
          | "FAILED_TO_SEND_OTP";
        retryAfterSeconds?: number;
      };

      if (!response.ok || payload.error) {
        const messageByErrorCode: Record<string, string> = {
          FORBIDDEN_ORIGIN:
            "Security check failed. Open the app from the configured URL and try again.",
          TOO_MANY_REQUESTS: "",
          INVALID_EMAIL:
            "This email address is not valid. Please check and try again.",
          WRONG_EMAIL:
            "The email address appears invalid. Please check it and retry.",
          FAILED_TO_SEND_OTP:
            "Email provider failed to deliver the code. Please retry in 30 seconds.",
        };

        if (payload.error === "TOO_MANY_REQUESTS") {
          const retryAfter = payload.retryAfterSeconds;
          const waitText = retryAfter
            ? `Please wait ${Math.max(1, retryAfter)} seconds and try again.`
            : "Please wait a few minutes before requesting another code.";
          setError(`Too many attempts. ${waitText}`);
          return;
        }

        const mappedMessage = messageByErrorCode[payload.error ?? ""];
        setError(
          mappedMessage ??
            "Failed to send verification code. Please try again.",
        );
        return;
      }

      setResendAvailableAt(Date.now() + 60_000);
      setStep(2);
      if (fromResend) {
        setOtp("");
        lastSubmittedOtpRef.current = "";
      }
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setActiveAction("idle");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-neutral-950 text-neutral-50 animate-in fade-in"
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        className="animate-in fade-in zoom-in-95"
        style={{
          border: "1px solid oklch(1 0 0 / 8%)",
          borderRadius: "16px",
          display: "flex",
          height: "720px",
          maxWidth: "980px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          className="animate-in slide-in-from-left"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.17 0.02 280), oklch(0.12 0.01 270), oklch(0.1 0 0))",
            height: "100%",
            overflow: "hidden",
            position: "relative",
            width: "50%",
          }}
        >
          <div style={{ inset: 0, opacity: 0.14, position: "absolute" }}>
            <Image
              alt="Abstract geometric AI mesh"
              className="h-full w-full object-cover"
              fill
              loading="eager"
              priority
              sizes="(max-width: 980px) 100vw, 48vw"
              unoptimized
              src="https://images.unsplash.com/photo-1746468659017-6f1ec22bb1f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMGxpbmVzJTIwbm9kZXMlMjBkYXJrJTIwcHVycGxlJTIwQUklMjB0ZWNobm9sb2d5fGVufDF8MXx8fDE3NzQzNDY5ODJ8MA&ixlib=rb-4.1.0&q=80&w=1200"
              style={{
                filter: "hue-rotate(-10deg) saturate(1.2)",
                mixBlendMode: "screen",
              }}
            />
          </div>
          <div
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.1 0.01 270 / 60%) 100%)",
              inset: 0,
              position: "absolute",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              padding: "40px 36px",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div style={{ alignItems: "center", display: "flex" }}>
              <span
                style={{
                  color: "oklch(0.985 0 0)",
                  fontSize: "34px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                MONOLITH
              </span>
              <span
                style={{
                  color: "oklch(0.488 0.243 264.376)",
                  fontSize: "34px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                _AI
              </span>
            </div>
            <p
              style={{
                color: "oklch(0.985 0 0 / 72%)",
                fontSize: "30px",
                fontWeight: 300,
                letterSpacing: "0.2px",
                lineHeight: 1.6,
              }}
            >
              Design with intelligence.
            </p>
          </div>
        </div>

        <div
          className="animate-in slide-in-from-right"
          style={{
            alignItems: "center",
            background: "oklch(0.145 0 0)",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            width: "50%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "360px",
            }}
          >
            {step === 1 ? (
              <>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    className="auth-glow-shift"
                    style={{
                      alignItems: "center",
                      background: "oklch(0.488 0.243 264.376 / 12%)",
                      border: "1px solid oklch(0.488 0.243 264.376 / 20%)",
                      borderRadius: "10px",
                      display: "flex",
                      height: "40px",
                      justifyContent: "center",
                      marginBottom: "8px",
                      width: "40px",
                    }}
                  >
                    <Hexagon
                      className="size-5"
                      style={{ color: "oklch(0.488 0.243 264.376)" }}
                    />
                  </div>
                  <h1
                    style={{
                      color: "oklch(0.985 0 0)",
                      fontSize: "24px",
                      fontWeight: 600,
                      lineHeight: 1.25,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isRegister
                      ? "Create account in MONOLITH_AI"
                      : "Sign in to MONOLITH_AI"}
                  </h1>
                  <p
                    style={{
                      color: "oklch(0.708 0 0)",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      textAlign: "center",
                    }}
                  >
                    Enter your email to receive a verification code
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "100%",
                  }}
                >
                  <div style={{ position: "relative", width: "100%" }}>
                    <div
                      style={{
                        left: "14px",
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                      }}
                    >
                      <Mail
                        className="size-4"
                        style={{
                          color: hasEmailError
                            ? "oklch(0.704 0.191 22.216)"
                            : "oklch(0.708 0 0)",
                        }}
                      />
                    </div>
                    <input
                      ref={emailInputRef}
                      autoComplete="email"
                      id="auth-email"
                      onBlur={() => setIsEmailFocused(false)}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError("");
                      }}
                      onFocus={() => setIsEmailFocused(true)}
                      placeholder="name@example.com"
                      style={{
                        background: hasEmailError
                          ? "oklch(0.16 0.015 10)"
                          : "oklch(0.17 0.005 270)",
                        border: hasEmailError
                          ? "1px solid oklch(0.704 0.191 22.216 / 80%)"
                          : isEmailAccent
                            ? "1px solid oklch(0.488 0.243 264.376 / 85%)"
                            : "1px solid oklch(1 0 0 / 18%)",
                        borderRadius: "8px",
                        color: "oklch(0.985 0 0)",
                        fontSize: "14px",
                        height: "46px",
                        outline: "none",
                        padding: "0 14px 0 42px",
                        width: "100%",
                      }}
                      type="email"
                      value={email}
                    />
                  </div>

                  <button
                    className="auth-primary-breathe"
                    disabled={isOtpBusy}
                    onClick={() => void requestOtp(false)}
                    style={{
                      alignItems: "center",
                      background: "oklch(0.488 0.243 264.376)",
                      border: "none",
                      borderRadius: "8px",
                      color: "oklch(0.985 0 0)",
                      cursor: isOtpBusy ? "not-allowed" : "pointer",
                      display: "flex",
                      fontSize: "14px",
                      fontWeight: 600,
                      gap: "8px",
                      height: "46px",
                      justifyContent: "center",
                      width: "100%",
                    }}
                    type="button"
                  >
                    {isSendingCode ? "Sending..." : "Send Code"}
                    <ArrowRight className="size-4" />
                  </button>

                  {error && step === 1 ? (
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <AlertTriangle
                        className="size-3.5"
                        style={{
                          color: "oklch(0.704 0.191 22.216)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          color: "oklch(0.704 0.191 22.216)",
                          fontSize: "12px",
                          lineHeight: 1.4,
                        }}
                      >
                        {error}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    gap: "14px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      background: "oklch(1 0 0 / 8%)",
                      flex: 1,
                      height: "1px",
                    }}
                  />
                  <span style={{ color: "oklch(0.708 0 0)", fontSize: "12px" }}>
                    or
                  </span>
                  <div
                    style={{
                      background: "oklch(1 0 0 / 8%)",
                      flex: 1,
                      height: "1px",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <button
                    disabled={!socialEnabled.google || isGoogleBusy}
                    onClick={() => void handleSocial("google")}
                    style={{
                      alignItems: "center",
                      background: "transparent",
                      border: "1px solid oklch(1 0 0 / 12%)",
                      borderRadius: "8px",
                      color: "oklch(0.985 0 0)",
                      cursor:
                        !socialEnabled.google || isGoogleBusy
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      fontSize: "14px",
                      gap: "10px",
                      height: "46px",
                      justifyContent: "center",
                      opacity: !socialEnabled.google || isGoogleBusy ? 0.6 : 1,
                      width: "100%",
                    }}
                    type="button"
                  >
                    <GoogleIcon />
                    {activeAction === "social-google"
                      ? "Connecting to Google..."
                      : "Continue with Google"}
                  </button>
                  <button
                    disabled={!socialEnabled.github || isGithubBusy}
                    onClick={() => void handleSocial("github")}
                    style={{
                      alignItems: "center",
                      background: "transparent",
                      border: "1px solid oklch(1 0 0 / 12%)",
                      borderRadius: "8px",
                      color: "oklch(0.985 0 0)",
                      cursor:
                        !socialEnabled.github || isGithubBusy
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      fontSize: "14px",
                      gap: "10px",
                      height: "46px",
                      justifyContent: "center",
                      opacity: !socialEnabled.github || isGithubBusy ? 0.6 : 1,
                      width: "100%",
                    }}
                    type="button"
                  >
                    <Github className="size-5" />
                    {activeAction === "social-github"
                      ? "Connecting to GitHub..."
                      : "Continue with GitHub"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    className="auth-glow-shift"
                    style={{
                      alignItems: "center",
                      background: "oklch(0.488 0.243 264.376 / 12%)",
                      border: "1px solid oklch(0.488 0.243 264.376 / 20%)",
                      borderRadius: "10px",
                      display: "flex",
                      height: "40px",
                      justifyContent: "center",
                      marginBottom: "8px",
                      width: "40px",
                    }}
                  >
                    <Grid3X3
                      className="size-5"
                      style={{ color: "oklch(0.488 0.243 264.376)" }}
                    />
                  </div>
                  <h2
                    style={{
                      color: "oklch(0.985 0 0)",
                      fontSize: "26px",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Check your inbox
                  </h2>
                  <p
                    style={{
                      color: "oklch(0.708 0 0)",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    We sent a 6-digit code to
                  </p>
                  <p
                    style={{
                      color: "oklch(0.985 0 0)",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {normalizedEmail}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    lastSubmittedOtpRef.current = "";
                    setError("");
                  }}
                  style={{
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    gap: "6px",
                  }}
                  type="button"
                >
                  <ArrowLeft
                    className="size-3.5"
                    style={{ color: "oklch(0.488 0.243 264.376)" }}
                  />
                  <span
                    style={{
                      color: "oklch(0.488 0.243 264.376)",
                      fontSize: "13px",
                    }}
                  >
                    Wrong email? Go back
                  </span>
                </button>

                <input
                  ref={otpInputRef}
                  className="sr-only"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => {
                    const numeric = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    setOtp(numeric);
                    if (numeric.length < 6) lastSubmittedOtpRef.current = "";
                    if (error) setError("");
                  }}
                  type="text"
                  value={otp}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  {OTP_SLOTS.map((slot, index) => {
                    const isActive = index === otp.length && otp.length < 6;
                    const hasDigit = Boolean(otpChars[index]);

                    return (
                      <button
                        key={slot}
                        onClick={() => otpInputRef.current?.focus()}
                        style={{
                          alignItems: "center",
                          background: hasOtpError
                            ? "oklch(0.16 0.015 10)"
                            : isActive
                              ? "oklch(0.17 0.005 270)"
                              : "oklch(0.18 0 0)",
                          border: hasOtpError
                            ? "1px solid oklch(0.704 0.191 22.216 / 70%)"
                            : isActive
                              ? "1px solid oklch(0.488 0.243 264.376 / 50%)"
                              : "1px solid oklch(1 0 0 / 10%)",
                          borderRadius: "10px",
                          color: "oklch(0.985 0 0)",
                          display: "flex",
                          fontSize: "24px",
                          fontWeight: 600,
                          height: "60px",
                          justifyContent: "center",
                          width: "52px",
                        }}
                        type="button"
                      >
                        {hasDigit ? (
                          otpChars[index]
                        ) : isActive ? (
                          <span
                            className="otp-caret-blink"
                            style={{
                              color: "oklch(0.488 0.243 264.376)",
                              fontSize: "20px",
                              fontWeight: 300,
                            }}
                          >
                            |
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "oklch(0.708 0 0)",
                              fontSize: "8px",
                              opacity: 0.5,
                            }}
                          >
                            ?
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {error && step === 2 ? (
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    <AlertTriangle
                      className="size-3.5"
                      style={{
                        color: "oklch(0.704 0.191 22.216)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "oklch(0.704 0.191 22.216)",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      {error}
                    </span>
                  </div>
                ) : null}

                <div
                  style={{ alignItems: "center", display: "flex", gap: "6px" }}
                >
                  <Clock
                    className="size-3.5"
                    style={{ color: "oklch(0.708 0 0)" }}
                  />
                  <span style={{ color: "oklch(0.708 0 0)", fontSize: "13px" }}>
                    Code expires in {Math.floor(secondsUntilResend / 60)}:
                    {String(secondsUntilResend % 60).padStart(2, "0")}
                  </span>
                </div>

                <p
                  style={{
                    color: "oklch(0.708 0 0)",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  Didn&apos;t receive a code?{" "}
                  <button
                    disabled={!canResend}
                    onClick={() => void requestOtp(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: canResend
                        ? "oklch(0.488 0.243 264.376)"
                        : "oklch(0.708 0 0)",
                      cursor: canResend ? "pointer" : "default",
                      padding: 0,
                      textDecoration: canResend ? "underline" : "none",
                    }}
                    type="button"
                  >
                    {canResend ? "Resend code" : "Resend"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
