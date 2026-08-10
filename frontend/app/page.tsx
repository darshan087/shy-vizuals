"use client";

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

type SiteSettings = {
  id?: number;
  businessName: string;
  email: string;
  phone: string;
  tagline: string | null;
  logoUrl: string | null;
};

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings | null>(null);

  const [settingsLoading, setSettingsLoading] = useState(true);

  // Load plans
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

  // Load business settings
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

  function formatPrice(price: number) {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  }

  // Build complete logo URL
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
              <img
                src={logoUrl}
                alt={businessName}
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

                {/* Dynamic tagline */}

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

      {/* ================= SHOWREEL ================= */}

      <section className="border-y border-white/10 bg-[#090909]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

          <div className="mb-10 flex items-end justify-between gap-6">

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Selected Work
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
                THE SHOWREEL
              </h2>
            </div>

            <div className="hidden text-sm text-white/30 sm:block">
              2026 / 01
            </div>
          </div>

          <div className="group relative aspect-video overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_50%)]" />

            <div className="absolute inset-0 flex items-center justify-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl text-black transition duration-300 group-hover:scale-110">
                ▶
              </div>

            </div>

            <div className="absolute bottom-6 left-6">

              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                {businessName}
              </p>

              <p className="mt-2 text-lg font-bold">
                SHOWREEL 2026
              </p>
            </div>

            <div className="absolute bottom-6 right-6 text-xs text-white/30">
              PLAY FILM
            </div>
          </div>
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
              <img
                src={logoUrl}
                alt={businessName}
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