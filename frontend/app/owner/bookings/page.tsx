"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  User,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  CreditCard,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Booking = {
  id: number;
  bookingNumber: string;

  customerName: string;
  phone: string;
  email: string;
  location: string;

  bookingDate: string;
  bookingTime?: string | null;

  plan?: {
    id: number;
    name: string;
    price: string;
  };

  totalAmount: string;
  advanceAmount: string;

  paymentStatus: string;
  bookingStatus: string;

  paymentScreenshot?: string | null;
  requirements?: string | null;

  createdAt: string;
  updatedAt?: string;
};

const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

const PAYMENT_STATUSES = [
  "PENDING",
  "PARTIAL",
  "PAID",
  "FAILED",
];

export default function OwnerBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [updatingPaymentId, setUpdatingPaymentId] =
    useState<number | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       * Backend route is:
       * GET /api/bookings
       *
       * NOT:
       * /api/bookings/owner
       */
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          cache: "no-store",
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("ownerToken");
        router.replace("/owner/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load bookings"
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Load bookings error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load bookings"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Update booking status
   *
   * Backend:
   * PATCH /api/bookings/:id
   */
  async function updateBookingStatus(
    bookingId: number,
    status: string
  ) {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            bookingStatus: status,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("ownerToken");
        router.replace("/owner/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update booking status"
        );
      }

      const updatedBooking =
        data.booking || null;

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                bookingStatus:
                  updatedBooking?.bookingStatus ||
                  status,
              }
            : booking
        )
      );

      setSelectedBooking((current) =>
        current?.id === bookingId
          ? {
              ...current,
              bookingStatus:
                updatedBooking?.bookingStatus ||
                status,
            }
          : current
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to update booking"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  /*
   * Update payment status
   *
   * Backend:
   * PATCH /api/bookings/:id
   */
  async function updatePaymentStatus(
    bookingId: number,
    status: string
  ) {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    try {
      setUpdatingPaymentId(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            paymentStatus: status,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("ownerToken");
        router.replace("/owner/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update payment status"
        );
      }

      const updatedBooking =
        data.booking || null;

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                paymentStatus:
                  updatedBooking?.paymentStatus ||
                  status,
              }
            : booking
        )
      );

      setSelectedBooking((current) =>
        current?.id === bookingId
          ? {
              ...current,
              paymentStatus:
                updatedBooking?.paymentStatus ||
                status,
            }
          : current
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to update payment status"
      );
    } finally {
      setUpdatingPaymentId(null);
    }
  }

  function formatDate(date: string) {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatMoney(value: string | number) {
    return Number(value || 0).toLocaleString("en-IN");
  }

  function getFileUrl(url?: string | null) {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${API_URL}${url}`;
  }

  const filteredBookings = bookings.filter(
    (booking) => {
      const text = [
        booking.bookingNumber,
        booking.customerName,
        booking.phone,
        booking.email,
        booking.location,
        booking.plan?.name,
        booking.bookingStatus,
        booking.paymentStatus,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    }
  );

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
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

          <div className="flex items-center gap-3">
            <Link
              href="/owner"
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <button
              onClick={loadBookings}
              className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:text-white"
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              Management
            </p>

            <h1 className="mt-3 text-4xl font-black sm:text-5xl">
              BOOKINGS
            </h1>

            <p className="mt-2 text-white/40">
              View and manage all customer bookings.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
            <p className="text-xs text-white/30">
              Total Bookings
            </p>

            <p className="mt-1 text-2xl font-black">
              {bookings.length}
            </p>
          </div>
        </div>

        {/* SEARCH */}

        <div className="mt-8">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer, booking number, phone, plan..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-4 outline-none transition focus:border-white/30"
            />
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <p className="font-semibold text-red-300">
              Could not load bookings
            </p>

            <p className="mt-1 text-sm text-red-300/60">
              {error}
            </p>

            <button
              onClick={loadBookings}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2
                size={30}
                className="mx-auto animate-spin text-white/30"
              />

              <p className="mt-4 text-sm text-white/40">
                Loading bookings...
              </p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-16 text-center">
            <CalendarDays
              size={45}
              className="mx-auto text-white/15"
            />

            <h2 className="mt-5 text-xl font-bold">
              No bookings found
            </h2>

            <p className="mt-2 text-sm text-white/30">
              {search
                ? "Try a different search."
                : "Customer bookings will appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}

            <div className="mt-8 hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/30">
                      <th className="px-6 py-5">
                        Customer
                      </th>

                      <th className="px-6 py-5">
                        Plan
                      </th>

                      <th className="px-6 py-5">
                        Date
                      </th>

                      <th className="px-6 py-5">
                        Amount
                      </th>

                      <th className="px-6 py-5">
                        Payment
                      </th>

                      <th className="px-6 py-5">
                        Status
                      </th>

                      <th className="px-6 py-5">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map(
                      (booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-white/10 last:border-0 hover:bg-white/[0.02]"
                        >
                          <td className="px-6 py-5">
                            <p className="font-semibold">
                              {booking.customerName}
                            </p>

                            <p className="mt-1 text-xs text-white/30">
                              {booking.bookingNumber}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-medium">
                              {booking.plan?.name ||
                                "Plan"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-sm">
                              {formatDate(
                                booking.bookingDate
                              )}
                            </p>

                            <p className="mt-1 text-xs text-white/30">
                              {booking.bookingTime ||
                                "Time not set"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-semibold">
                              ₹
                              {formatMoney(
                                booking.totalAmount
                              )}
                            </p>

                            <p className="mt-1 text-xs text-white/30">
                              Advance ₹
                              {formatMoney(
                                booking.advanceAmount
                              )}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <PaymentBadge
                              status={
                                booking.paymentStatus
                              }
                            />
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                booking.bookingStatus
                              }
                            />
                          </td>

                          <td className="px-6 py-5">
                            <button
                              onClick={() =>
                                setSelectedBooking(
                                  booking
                                )
                              }
                              className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:bg-white hover:text-black"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE */}

            <div className="mt-8 space-y-4 lg:hidden">
              {filteredBookings.map(
                (booking) => (
                  <button
                    key={booking.id}
                    onClick={() =>
                      setSelectedBooking(
                        booking
                      )
                    }
                    className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold">
                          {booking.customerName}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {booking.bookingNumber}
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          booking.bookingStatus
                        }
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/30">
                          Plan
                        </p>

                        <p className="mt-1 text-sm">
                          {booking.plan?.name ||
                            "Plan"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/30">
                          Date
                        </p>

                        <p className="mt-1 text-sm">
                          {formatDate(
                            booking.bookingDate
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/30">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          ₹
                          {formatMoney(
                            booking.totalAmount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/30">
                          Payment
                        </p>

                        <div className="mt-1">
                          <PaymentBadge
                            status={
                              booking.paymentStatus
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* DETAILS MODAL */}

      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111]">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111] p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Booking Details
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedBooking.bookingNumber}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-full border border-white/10 p-2 text-white/50 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-7 p-6">
              {/* CUSTOMER */}

              <section>
                <SectionTitle>
                  Customer
                </SectionTitle>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem
                    icon={<User size={16} />}
                    label="Name"
                    value={
                      selectedBooking.customerName
                    }
                  />

                  <InfoItem
                    icon={<Phone size={16} />}
                    label="Phone"
                    value={
                      selectedBooking.phone
                    }
                  />

                  <InfoItem
                    icon={<Mail size={16} />}
                    label="Email"
                    value={
                      selectedBooking.email
                    }
                  />

                  <InfoItem
                    icon={<MapPin size={16} />}
                    label="Location"
                    value={
                      selectedBooking.location
                    }
                  />
                </div>
              </section>

              {/* SHOOT */}

              <section>
                <SectionTitle>
                  Shoot Details
                </SectionTitle>

                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoItem
                    icon={
                      <CalendarDays size={16} />
                    }
                    label="Date"
                    value={formatDate(
                      selectedBooking.bookingDate
                    )}
                  />

                  <InfoItem
                    icon={<Clock3 size={16} />}
                    label="Time"
                    value={
                      selectedBooking.bookingTime ||
                      "Not specified"
                    }
                  />

                  <InfoItem
                    icon={<MapPin size={16} />}
                    label="Location"
                    value={
                      selectedBooking.location
                    }
                  />
                </div>
              </section>

              {/* PACKAGE */}

              <section>
                <SectionTitle>
                  Package & Payment
                </SectionTitle>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem
                    label="Plan"
                    value={
                      selectedBooking.plan?.name ||
                      "Plan"
                    }
                  />

                  <InfoItem
                    label="Total Amount"
                    value={`₹${formatMoney(
                      selectedBooking.totalAmount
                    )}`}
                  />

                  <InfoItem
                    label="Advance"
                    value={`₹${formatMoney(
                      selectedBooking.advanceAmount
                    )}`}
                  />

                  <InfoItem
                    icon={
                      <CreditCard size={16} />
                    }
                    label="Payment Status"
                    value={
                      selectedBooking.paymentStatus
                    }
                  />
                </div>
              </section>

              {/* REQUIREMENTS */}

              {selectedBooking.requirements && (
                <section>
                  <SectionTitle>
                    Customer Requirements
                  </SectionTitle>

                  <div className="rounded-2xl border border-white/10 bg-black p-5 text-sm leading-7 text-white/60">
                    {
                      selectedBooking.requirements
                    }
                  </div>
                </section>
              )}

              {/* PAYMENT SCREENSHOT */}

              <section>
                <SectionTitle>
                  Payment Screenshot
                </SectionTitle>

                {selectedBooking.paymentScreenshot ? (
                  <a
                    href={getFileUrl(
                      selectedBooking.paymentScreenshot
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-black"
                  >
                    <img
                      src={getFileUrl(
                        selectedBooking.paymentScreenshot
                      )}
                      alt="Payment screenshot"
                      className="max-h-[450px] w-full object-contain"
                    />

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-xs backdrop-blur">
                      <ExternalLink size={14} />
                      Open image
                    </div>
                  </a>
                ) : (
                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
                    <p className="text-sm text-yellow-300">
                      No payment screenshot has
                      been uploaded yet.
                    </p>
                  </div>
                )}
              </section>

              {/* PAYMENT STATUS */}

              <section>
                <SectionTitle>
                  Payment Verification
                </SectionTitle>

                <div className="grid gap-3 sm:grid-cols-2">
                  {PAYMENT_STATUSES.map(
                    (status) => {
                      const active =
                        selectedBooking.paymentStatus ===
                        status;

                      const updating =
                        updatingPaymentId ===
                        selectedBooking.id;

                      return (
                        <button
                          key={status}
                          disabled={updating}
                          onClick={() =>
                            updatePaymentStatus(
                              selectedBooking.id,
                              status
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm transition ${
                            active
                              ? "border-white bg-white text-black"
                              : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {updating &&
                          active ? (
                            <Loader2
                              size={16}
                              className="mx-auto animate-spin"
                            />
                          ) : (
                            status.replace(
                              "_",
                              " "
                            )
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </section>

              {/* BOOKING STATUS */}

              <section>
                <SectionTitle>
                  Booking Status
                </SectionTitle>

                <div className="grid gap-2 sm:grid-cols-3">
                  {BOOKING_STATUSES.map(
                    (status) => {
                      const active =
                        selectedBooking.bookingStatus ===
                        status;

                      const updating =
                        updatingId ===
                        selectedBooking.id;

                      return (
                        <button
                          key={status}
                          disabled={updating}
                          onClick={() =>
                            updateBookingStatus(
                              selectedBooking.id,
                              status
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm transition ${
                            active
                              ? "border-white bg-white text-black"
                              : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {updating && active ? (
                            <Loader2
                              size={16}
                              className="mx-auto animate-spin"
                            />
                          ) : (
                            status.replace(
                              "_",
                              " "
                            )
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </section>

              {/* QUICK ACTIONS */}

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-white/90"
                >
                  <Phone size={17} />
                  Call Customer
                </a>

                <a
                  href={`mailto:${selectedBooking.email}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 font-semibold transition hover:bg-white/5"
                >
                  <Mail size={17} />
                  Email Customer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/30">
      {children}
    </p>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-4">
      <div className="flex items-center gap-2 text-xs text-white/30">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-sm text-white/80">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status?.toUpperCase() || "PENDING";

  const isGood =
    normalized === "CONFIRMED" ||
    normalized === "COMPLETED";

  const isBad =
    normalized === "CANCELLED" ||
    normalized === "REJECTED";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
        isGood
          ? "border-green-500/20 bg-green-500/10 text-green-300"
          : isBad
          ? "border-red-500/20 bg-red-500/10 text-red-300"
          : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
      }`}
    >
      {isGood ? (
        <CheckCircle2 size={11} />
      ) : isBad ? (
        <XCircle size={11} />
      ) : (
        <Clock3 size={11} />
      )}

      {normalized.replace("_", " ")}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status?.toUpperCase() || "PENDING";

  const isPaid = normalized === "PAID";
  const isPartial = normalized === "PARTIAL";
  const isFailed = normalized === "FAILED";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
        isPaid
          ? "border-green-500/20 bg-green-500/10 text-green-300"
          : isPartial
          ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
          : isFailed
          ? "border-red-500/20 bg-red-500/10 text-red-300"
          : "border-white/10 bg-white/5 text-white/50"
      }`}
    >
      {normalized}
    </span>
  );
}