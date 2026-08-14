"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type SiteSettings = {
  businessName: string;
  tagline: string | null;
  logoUrl: string | null;
};

export default function Navbar() {
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(
          `${API_URL}/api/site-settings`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (data.success) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadSettings();
  }, []);

  const logo = settings?.logoUrl
    ? settings.logoUrl.startsWith("http")
      ? settings.logoUrl
      : `${API_URL}${settings.logoUrl}`
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* LOGO */}

        <Link href="/" className="flex items-center">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={180}
              height={44}
              unoptimized
              className="h-11 w-auto object-contain"
            />
          ) : (
            <div>
              <h1 className="text-xl font-black tracking-[0.18em]">
                SHY.
              </h1>

              <p className="text-[8px] tracking-[0.45em] text-white/40">
                VIZUALS
              </p>
            </div>
          )}
        </Link>

        {/* OWNER NAVIGATION */}

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/owner/dashboard"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/owner/bookings"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Bookings
          </Link>

          <Link
            href="/owner/plans"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Plans
          </Link>

          <Link
            href="/owner/media"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Media
          </Link>
        </div>

        {/* OWNER */}

        <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/60">
          OWNER
        </div>

      </div>
    </nav>
  );
}