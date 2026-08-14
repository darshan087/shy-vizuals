"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Plan = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
};

type Media = {
  id: number;
  title: string;
  description: string | null;
  mediaType: "IMAGE" | "VIDEO";
  fileUrl: string;
  thumbnailUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

type SiteSettings = {
  id?: number;
  businessName: string;
  email: string;
  phone: string;
  tagline: string | null;
  logoUrl: string | null;
};

export default function Home() {
  // =========================
  // PLANS
  // =========================

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // =========================
  // SHOWREEL MEDIA
  // =========================

  const [media, setMedia] = useState<Media[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);

  // =========================
  // SITE SETTINGS
  // =========================

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings | null>(null);

  const [settingsLoading, setSettingsLoading] = useState(true);

  // =========================
  // LOAD PLANS
  // =========================

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch(
          `${API_URL}/api/plans`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setPlans(data.plans || []);
        }
      } catch (error) {
        console.error("Failed to load plans:", error);
      } finally {
        setPlansLoading(false);
      }
    }

    loadPlans();
  }, []);

  // =========================
  // LOAD SHOWREEL MEDIA
  // =========================

  useEffect(() => {
    async function loadMedia() {
      try {
        const response = await fetch(
          `${API_URL}/api/media`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setMedia(data.media || []);
        }
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setMediaLoading(false);
      }
    }

    loadMedia();
  }, []);

  // =========================
  // LOAD SITE SETTINGS
  // =========================

  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const response = await fetch(
          `${API_URL}/api/site-settings`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setSiteSettings(data.settings);
        }
      } catch (error) {
        console.error(
          "Failed to load site settings:",
          error
        );
      } finally {
        setSettingsLoading(false);
      }
    }

    loadSiteSettings();
  }, []);

  // =========================
  // HELPERS
  // =========================

  function formatPrice(price: number) {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  }

  function mediaUrl(url: string) {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${API_URL}${url}`;
  }

  // =========================
  // SETTINGS
  // =========================

  const logoUrl =
    siteSettings?.logoUrl
      ? siteSettings.logoUrl.startsWith("http")
        ? siteSettings.logoUrl
        : `${API_URL}${siteSettings.logoUrl}`
      : null;

  const businessName =
    siteSettings?.businessName || "Shy.Vizuals";

  const tagline =
    siteSettings?.tagline ||
    "Turning moments into cinematic stories.";

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* ================= NAVBAR ================= */}

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* LOGO */}

          <Link href="/" className="flex items-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={businessName}
                width={180}
                height={44}
                unoptimized
                className="h-11 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <div>
                <div className="text-xl font-black tracking-[0.18em]">
                  SHY.
                </div>

                <div className="text-[8px] tracking-[0.42em] text-white/40">
                  VIZUALS
                </div>
              </div>
            )}
          </Link>

          {/* NAVIGATION */}

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#services"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Services
            </a>

            <a
              href="#showreel"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Showreel
            </a>

            <a
              href="#about"
              className="text-sm text-white/50 transition hover:text-white"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Contact
            </a>
          </div>

          {/* BOOK BUTTON */}

          <Link
            href="/booking"
            className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/80"
          >
            BOOK A SHOOT →
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="relative flex min-h-screen items-center overflow-hidden">

        <div className="absolute inset-0">

          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[120px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_70%)]" />

        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-24 lg:px-8">

          <div className="max-w-5xl">

            <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/40">
              <span className="h-px w-10 bg-white/30" />
              Cinematic Visual Studio
            </div>

            <h1 className="text-[15vw] font-black leading-[0.78] tracking-[-0.07em] sm:text-[12vw] lg:text-[10rem]">
              MAKE
              <br />
              IT
              <br />

              <span className="text-white/25">
                LOOK
              </span>

              <br />

              <span className="italic">
                EPIC.
              </span>
            </h1>

            <div className="mt-12 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">

              <div className="max-w-md">

                <p className="text-base leading-7 text-white/45">
                  Cinematic visuals, professional edits and
                  scroll-stopping content built for brands,
                  creators and unforgettable moments.
                </p>

                <p className="mt-4 text-sm text-white/25">
                  {tagline}
                </p>

              </div>

              <Link
                href="/booking"
                className="w-fit rounded-full border border-white/15 px-6 py-4 text-sm transition hover:border-white/40 hover:bg-white hover:text-black"
              >
                START YOUR PROJECT →
              </Link>

            </div>

          </div>

        </div>

        <div className="absolute bottom-8 left-5 text-[10px] uppercase tracking-[0.3em] text-white/25 lg:left-8">
          {businessName}
        </div>

        <div className="absolute bottom-8 right-5 text-[10px] uppercase tracking-[0.3em] text-white/25 lg:right-8">
          SCROLL TO EXPLORE ↓
        </div>

      </section>

      {/* =========================================================
          SHOWREEL
          REAL MEDIA FROM OWNER PANEL
          ========================================================= */}

      <section
        id="showreel"
        className="border-y border-white/10 bg-[#090909]"
      >

        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

          {/* SHOWREEL HEADER */}

          <div className="mb-12 flex items-end justify-between gap-6">

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Selected Work
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
                THE SHOWREEL
              </h2>

            </div>

            <p className="hidden text-sm text-white/30 md:block">
              {media.length} Project
              {media.length !== 1 ? "s" : ""}
            </p>

          </div>

          {/* LOADING */}

          {mediaLoading ? (

            <div className="rounded-3xl border border-white/10 bg-[#111] p-20 text-center">

              <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />

              <p className="text-sm text-white/40">
                Loading Showreel...
              </p>

            </div>

          ) : media.length === 0 ? (

            /* EMPTY STATE */

            <div className="rounded-3xl border border-dashed border-white/10 bg-[#111] p-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-2xl">
                ▶
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                No Media Uploaded
              </h3>

              <p className="mt-4 text-white/40">
                Upload your showreel or projects from Owner Panel.
              </p>

            </div>

          ) : (

            /* MEDIA GRID */

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {media.map((item) => (

                <div
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-[#111]"
                >

                  {/* MEDIA */}

                  <div className="relative aspect-video overflow-hidden bg-black">

                    {item.mediaType === "VIDEO" ? (

                      <video
                        controls
                        preload="metadata"
                        playsInline
                        className="h-full w-full object-cover"
                        poster={
                          item.thumbnailUrl
                            ? mediaUrl(item.thumbnailUrl)
                            : undefined
                        }
                      >
                        <source
                          src={mediaUrl(item.fileUrl)}
                          type="video/mp4"
                        />

                        Your browser does not support video playback.
                      </video>

                    ) : (

                      <Image
                        src={mediaUrl(item.fileUrl)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        unoptimized
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                    )}

                  </div>

                  {/* MEDIA INFORMATION */}

                  <div className="p-6">

                    <div className="mb-3 flex items-center justify-between">

                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        {item.mediaType === "VIDEO"
                          ? "Video"
                          : "Visual"}
                      </span>

                      <span className="text-xs text-white/20">
                        {String(item.id).padStart(2, "0")}
                      </span>

                    </div>

                    <h3 className="text-xl font-black tracking-tight">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-3 text-sm leading-6 text-white/40">
                        {item.description}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* ================= SERVICES ================= */}

      <section
        id="services"
        className="mx-auto max-w-7xl px-5 py-28 lg:px-8"
      >

        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              What We Do
            </p>

            <h2 className="mt-3 text-5xl font-black tracking-[-0.04em] sm:text-7xl">
              SERVICES
            </h2>

          </div>

          <p className="max-w-sm text-sm leading-6 text-white/40">
            Choose a package and turn your idea into
            professional cinematic content.
          </p>

        </div>

        <div className="mt-16 divide-y divide-white/10 border-y border-white/10">

          {plansLoading ? (

            <div className="py-16 text-center text-sm text-white/30">
              Loading services...
            </div>

          ) : plans.length === 0 ? (

            <div className="py-16 text-center text-sm text-white/30">
              No services available right now.
            </div>

          ) : (

            plans.map((plan, index) => (

              <Link
                href={`/booking?plan=${plan.id}`}
                key={plan.id}
                className="group grid gap-6 py-8 transition hover:px-4 sm:grid-cols-[70px_1fr_auto] sm:items-center"
              >

                <span className="text-xs text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>

                  <h3 className="text-2xl font-black tracking-tight transition group-hover:italic sm:text-4xl">
                    {plan.name}
                  </h3>

                  {plan.description && (
                    <p className="mt-2 max-w-xl text-sm text-white/35">
                      {plan.description}
                    </p>
                  )}

                </div>

                <div className="flex items-center justify-between gap-6 sm:block sm:text-right">

                  <p className="font-bold">
                    {formatPrice(plan.price)}
                  </p>

                  <span className="text-xl transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

              </Link>

            ))

          )}

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="border-y border-white/10 bg-white/[0.025]"
      >

        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-28 lg:grid-cols-2 lg:px-8">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              About {businessName}
            </p>

            <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl">

              WE DON'T
              <br />

              JUST SHOOT.
              <br />

              <span className="text-white/25">
                WE CREATE
              </span>

              <br />

              <i>MEMORIES.</i>

            </h2>

          </div>

          <div className="flex flex-col justify-end">

            <p className="text-lg leading-8 text-white/45">
              {businessName} is a cinematic visual studio
              focused on creating powerful videos that
              people remember.
            </p>

            <p className="mt-6 text-sm leading-7 text-white/30">
              From car deliveries and brand campaigns to
              model shoots and promotional content, every
              project is crafted with attention to detail,
              movement, music and story.
            </p>

            <Link
              href="/booking"
              className="mt-8 w-fit border-b border-white/30 pb-2 text-sm font-bold transition hover:border-white"
            >
              WORK WITH US →
            </Link>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section
        id="contact"
        className="relative overflow-hidden"
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-32 text-center lg:px-8">

          <p className="text-xs uppercase tracking-[0.35em] text-white/30">
            Ready when you are
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-6xl font-black leading-[0.85] tracking-[-0.06em] sm:text-8xl lg:text-9xl">

            LET'S CREATE
            <br />

            <span className="italic text-white/30">
              SOMETHING.
            </span>

          </h2>

          <Link
            href="/booking"
            className="mt-12 inline-flex rounded-full bg-white px-8 py-4 font-bold text-black transition hover:bg-white/80"
          >
            BOOK YOUR SHOOT →
          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          {/* FOOTER LOGO */}

          <div className="flex items-center">

            {logoUrl ? (

              <Image
                src={logoUrl}
                alt={businessName}
                width={160}
                height={40}
                unoptimized
                className="h-10 w-auto max-w-[160px] object-contain"
              />

            ) : (

              <div>

                <p className="font-black tracking-[0.18em]">
                  {businessName}
                </p>

                <p className="mt-1 text-xs text-white/25">
                  CINEMATIC VISUAL STUDIO
                </p>

              </div>

            )}

          </div>

          {/* SOCIAL LINKS */}

          <div className="flex gap-6 text-sm text-white/40">

            <a
              href="#"
              className="transition hover:text-white"
            >
              Instagram
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              YouTube
            </a>

          </div>

          <p className="text-xs text-white/20">
            © 2026 {businessName}
          </p>

        </div>

      </footer>

    </main>
  );
}