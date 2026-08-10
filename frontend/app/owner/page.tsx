"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  LogOut,
  Menu,
  RefreshCw,
  Users,
  X,
  ArrowUpRight,
  Image,
  Settings,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RecentBooking = {
  id?: number;
  customerName?: string;
  name?: string;
  plan?: { name?: string } | null;
  planName?: string;
  bookingNumber?: string;
  totalAmount?: number;
  amount?: number;
  bookingStatus?: string;
  status?: string;
};

type DashboardData = {
  bookings?: {
    total?: number;
    pending?: number;
    confirmed?: number;
    inProgress?: number;
    completed?: number;
    cancelled?: number;
  };
  money?: {
    total?: number;
    advance?: number;
    pending?: number;
  };
  recentBookings?: RecentBooking[];
};

export default function OwnerDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/owner/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("ownerToken");
        router.replace("/owner/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load dashboard"
        );
      }

      setDashboard(data.dashboard);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("ownerToken");
    router.replace("/owner/login");
  }

  const bookings = dashboard?.bookings || {};
  const money = dashboard?.money || {};
  const recentBookings = dashboard?.recentBookings || [];

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 lg:px-8">

          <Link
            href="/owner"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-black text-black">
              S
            </div>

            <div>
              <p className="font-black tracking-[0.15em]">
                SHY.
              </p>

              <p className="text-[8px] tracking-[0.35em] text-white/40">
                VIZUALS OWNER
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
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
              {mobileMenu ? (
                <X size={19} />
              ) : (
                <Menu size={19} />
              )}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
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

      {/* CONTENT */}
      <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-12">

        {/* HEADER */}
        <div className="mb-10">

          <p className="text-xs uppercase tracking-[0.3em] text-white/30">
            Owner Panel
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">

            <div>
              <h1 className="text-4xl font-black sm:text-5xl">
                Dashboard
              </h1>

              <p className="mt-2 text-white/40">
                Manage your Shy.Vizuals business.
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <RefreshCw size={15} />
              Refresh
            </button>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">

            <p className="font-semibold">
              Dashboard error
            </p>

            <p className="mt-1 text-sm opacity-70">
              {error}
            </p>

          </div>
        )}

        {loading ? (

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-white/30"
              />

              <p className="mt-4 text-sm text-white/40">
                Loading dashboard...
              </p>

            </div>

          </div>

        ) : (

          <>
            {/* STAT CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Total Bookings"
                value={bookings.total ?? 0}
                icon={<CalendarDays size={20} />}
              />

              <StatCard
                title="Pending"
                value={bookings.pending ?? 0}
                icon={<Clock3 size={20} />}
              />

              <StatCard
                title="Confirmed"
                value={bookings.confirmed ?? 0}
                icon={<CheckCircle2 size={20} />}
              />

              <StatCard
                title="Customers"
                value={bookings.total ?? 0}
                icon={<Users size={20} />}
              />

            </div>

            {/* MONEY */}
            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <MoneyCard
                title="Total Booking Value"
                value={money.total}
              />

              <MoneyCard
                title="Advance Received"
                value={money.advance}
              />

              <MoneyCard
                title="Pending Amount"
                value={money.pending}
              />

            </div>

            {/* MAIN GRID */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">

              {/* RECENT BOOKINGS */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

                <div className="flex items-center justify-between border-b border-white/10 p-6">

                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                      Activity
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Recent Bookings
                    </h2>
                  </div>

                  <Link
                    href="/owner/bookings"
                    className="flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
                  >
                    View all
                    <ArrowUpRight size={15} />
                  </Link>

                </div>

                {recentBookings.length === 0 ? (

                  <div className="p-12 text-center">

                    <CalendarDays
                      size={35}
                      className="mx-auto text-white/15"
                    />

                    <p className="mt-4 font-semibold">
                      No bookings yet
                    </p>

                    <p className="mt-2 text-sm text-white/30">
                      New customer bookings will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-white/10">

                    {recentBookings.map(
                      (booking: RecentBooking, index: number) => (

                        <div
                          key={booking.id ?? index}
                          className="flex flex-wrap items-center justify-between gap-4 p-5"
                        >

                          <div>

                            <p className="font-semibold">
                              {booking.customerName ||
                                booking.name ||
                                "Customer"}
                            </p>

                            <p className="mt-1 text-sm text-white/35">
                              {booking.plan?.name ||
                                booking.planName ||
                                "Plan"}
                            </p>

                            <p className="mt-1 text-xs text-white/25">
                              {booking.bookingNumber ||
                                `Booking #${booking.id}`}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-semibold">
                              ₹
                              {Number(
                                booking.totalAmount ||
                                  booking.amount ||
                                  0
                              ).toLocaleString("en-IN")}
                            </p>

                            <StatusBadge
                              status={
                                booking.bookingStatus ||
                                booking.status ||
                                "PENDING"
                              }
                            />

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

              {/* QUICK ACTIONS */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Management
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Quick Actions
                </h2>

                <div className="mt-6 space-y-3">

                  <QuickAction
                    href="/owner/bookings"
                    icon={<CalendarDays size={19} />}
                    title="Manage Bookings"
                    description="View and update customer bookings"
                  />

                  <QuickAction
                    href="/owner/plans"
                    icon={<IndianRupee size={19} />}
                    title="Manage Plans"
                    description="Edit prices and plan images"
                  />

                  <QuickAction
                    href="/owner/media"
                    icon={<Image size={19} />}
                    title="Manage Media"
                    description="Upload photos and videos"
                  />

                  <QuickAction
                    href="/owner/settings"
                    icon={<Settings size={19} />}
                    title="Payment & Site Settings"
                    description="UPI, QR, advance and business details"
                  />

                </div>

              </section>

            </div>

            {/* STATUS OVERVIEW */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

              <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                Booking Overview
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Booking Status
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                <StatusStat
                  label="Pending"
                  value={bookings.pending ?? 0}
                />

                <StatusStat
                  label="Confirmed"
                  value={bookings.confirmed ?? 0}
                />

                <StatusStat
                  label="In Progress"
                  value={bookings.inProgress ?? 0}
                />

                <StatusStat
                  label="Completed"
                  value={bookings.completed ?? 0}
                />

                <StatusStat
                  label="Cancelled"
                  value={bookings.cancelled ?? 0}
                />

              </div>

            </section>
          </>

        )}

      </div>
    </main>
  );
}

/* STAT CARD */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

      <div className="flex items-center justify-between">

        <span className="text-white/30">
          {icon}
        </span>

        <span className="text-xs uppercase tracking-wider text-white/20">
          Shy
        </span>

      </div>

      <p className="mt-7 text-sm text-white/40">
        {title}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}

/* MONEY CARD */

function MoneyCard({
  title,
  value,
}: {
  title: string;
  value?: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

      <p className="text-sm text-white/40">
        {title}
      </p>

      <p className="mt-3 text-2xl font-black">
        ₹
        {Number(value || 0).toLocaleString("en-IN")}
      </p>

    </div>
  );
}

/* STATUS STAT */

function StatusStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-5">

      <p className="text-sm text-white/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* STATUS BADGE */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const label = status.replace(/_/g, " ");

  return (
    <span className="mt-2 inline-block rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/40">
      {label}
    </span>
  );
}

/* QUICK ACTION */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black p-4 transition hover:border-white/25 hover:bg-white/[0.04]"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/60">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/30">
          {description}
        </p>

      </div>

      <ArrowUpRight
        size={16}
        className="ml-auto shrink-0 text-white/20"
      />

    </Link>
  );
}