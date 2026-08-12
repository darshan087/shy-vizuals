"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, RefreshCw, X } from "lucide-react";

export default function OwnerNavbar() {
  const router = useRouter();

  const [mobileMenu, setMobileMenu] = useState(false);

  const loadDashboard = () => {
    router.refresh();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("accessToken");

    router.push("/owner/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/owner" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-black text-black">
            S
          </div>

          <div>
            <p className="font-black tracking-[0.15em]">SHY.</p>

            <p className="text-[8px] tracking-[0.35em] text-white/40">
              VIZUALS OWNER
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/owner"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm"
          >
            Dashboard
          </Link>

          <Link
            href="/owner/bookings"
            className="rounded-lg px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            Bookings
          </Link>

          <Link
            href="/owner/plans"
            className="rounded-lg px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            Plans
          </Link>

          <Link
            href="/owner/media"
            className="rounded-lg px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            Media
          </Link>

          <Link
            href="/owner/settings"
            className="rounded-lg px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            Settings
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboard}
            className="hidden rounded-lg border border-white/10 p-2.5 text-white/50 transition hover:text-white sm:block"
            title="Refresh"
          >
            <RefreshCw size={17} />
          </button>

          <button
            onClick={logout}
            className="hidden items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:text-white sm:flex"
          >
            <LogOut size={16} />
            Logout
          </button>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg border border-white/10 p-2.5 md:hidden"
          >
            {mobileMenu ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-white/10 p-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              href="/owner"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg bg-white/10 px-4 py-3"
            >
              Dashboard
            </Link>

            <Link
              href="/owner/bookings"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-4 py-3 text-white/60"
            >
              Bookings
            </Link>

            <Link
              href="/owner/plans"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-4 py-3 text-white/60"
            >
              Plans
            </Link>

            <Link
              href="/owner/media"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-4 py-3 text-white/60"
            >
              Media
            </Link>

            <Link
              href="/owner/settings"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-4 py-3 text-white/60"
            >
              Settings
            </Link>

            <button
              onClick={logout}
              className="mt-2 flex items-center gap-2 rounded-lg px-4 py-3 text-left text-red-300"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}