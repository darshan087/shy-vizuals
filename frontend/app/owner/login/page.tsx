"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  Loader2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OwnerLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid owner credentials"
        );
      }

      // Make absolutely sure this is an OWNER login.
      if (data.owner?.role !== "OWNER") {
        throw new Error("This account does not have owner access.");
      }

      if (!data.token) {
        throw new Error("Owner token was not returned by the server.");
      }

      // Remove any customer authentication that could
      // interfere with the owner dashboard.
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");

      // Save ONLY the owner token.
      localStorage.setItem("ownerToken", data.token);

      // Go directly to the owner dashboard.
      router.replace("/owner");
    } catch (err) {
      console.error("Owner login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Owner login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-10">
        <div className="w-full">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 sm:p-10">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                SHY.VIZUALS
              </p>

              <h1 className="mt-4 text-4xl font-black">
                OWNER LOGIN
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Sign in to manage bookings, plans,
                payments and media.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Owner Gmail
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="shyvizuals@gmail.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-black py-4 pl-11 pr-4 outline-none transition focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-black py-4 pl-11 pr-4 outline-none transition focus:border-white/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 font-bold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  "SIGN IN AS OWNER"
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <p className="text-xs text-white/25">
                Owner access only
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}