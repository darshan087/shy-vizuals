"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Plan = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
};

type SiteSettings = {
  businessName: string;
  email: string;
  phone: string;
  tagline: string | null;
  logoUrl: string | null;
};

type BookingResponse = {
  success: boolean;
  message: string;
  booking?: {
    id: number;
    bookingNumber: string;
    totalAmount: string;
    advanceAmount: string;
    paymentStatus: string;
    bookingStatus: string;
  };
};

export default function BookingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings | null>(null);

  const [selectedPlan, setSelectedPlan] =
    useState<number | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [requirements, setRequirements] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD PLANS + BUSINESS SETTINGS
  // --------------------------------------------------

  useEffect(() => {
    async function loadData() {
      try {
        // Load plans
        const plansResponse = await fetch(
          `${API_URL}/api/plans`
        );

        if (!plansResponse.ok) {
          throw new Error("Unable to load plans");
        }

        const plansData = await plansResponse.json();

        if (
          plansData.success &&
          Array.isArray(plansData.plans)
        ) {
          setPlans(plansData.plans);

          if (plansData.plans.length > 0) {
            setSelectedPlan(plansData.plans[0].id);
          }
        } else {
          throw new Error("Invalid plans response");
        }

        // Load business settings
        try {
          const settingsResponse = await fetch(
            `${API_URL}/api/site-settings`,
            {
              cache: "no-store",
            }
          );

          if (settingsResponse.ok) {
            const settingsData =
              await settingsResponse.json();

            if (
              settingsData.success &&
              settingsData.settings
            ) {
              setSiteSettings(settingsData.settings);
            }
          }
        } catch (settingsError) {
          console.error(
            "Failed to load business settings:",
            settingsError
          );
        }
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load services. Make sure the backend is running on port 5000."
        );
      } finally {
        setLoadingPlans(false);
      }
    }

    loadData();
  }, []);

  // --------------------------------------------------
  // SELECTED PLAN
  // --------------------------------------------------

  const selectedPlanData = plans.find(
    (plan) => plan.id === selectedPlan
  );

  // --------------------------------------------------
  // LOGO URL
  // --------------------------------------------------

  const logoUrl = siteSettings?.logoUrl
    ? siteSettings.logoUrl.startsWith("http")
      ? siteSettings.logoUrl
      : `${API_URL}${siteSettings.logoUrl}`
    : "";

  // --------------------------------------------------
  // BUSINESS NAME
  // --------------------------------------------------

  const businessName =
    siteSettings?.businessName || "SHY.VIZUALS";

  // --------------------------------------------------
  // SUBMIT BOOKING
  // --------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!selectedPlan) {
      setError("Please select a service.");
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter your location.");
      return;
    }

    if (!bookingDate) {
      setError("Please select a booking date.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            phone,
            email,
            location,
            bookingDate,
            bookingTime: bookingTime || null,
            planId: selectedPlan,
            requirements: requirements || null,
          }),
        }
      );

      const data: BookingResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create booking."
        );
      }

      setMessage(
        `Booking created successfully! Your booking number is ${
          data.booking?.bookingNumber || "generated"
        }.`
      );

      if (data.booking) {
        window.location.href =
          `/payment?bookingId=${data.booking.id}` +
          `&bookingNumber=${encodeURIComponent(
            data.booking.bookingNumber
          )}` +
          `&amount=${encodeURIComponent(
            data.booking.totalAmount
          )}`;

        return;
      }

      setCustomerName("");
      setPhone("");
      setEmail("");
      setLocation("");
      setBookingDate("");
      setBookingTime("");
      setRequirements("");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your booking."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-black">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* LOGO */}

          <Link href="/" className="flex items-center gap-3">

            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={businessName}
                width={180}
                height={48}
                unoptimized
                className="h-12 w-auto max-w-[180px] object-contain"
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

          {/* BACK */}

          <Link
            href="/"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Back Home
          </Link>

        </div>
      </nav>

      {/* HEADER */}

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-20 lg:px-8">

        <p className="text-xs uppercase tracking-[0.35em] text-white/30">
          Start Your Project
        </p>

        <h1 className="mt-5 max-w-4xl text-6xl font-black leading-[0.85] tracking-[-0.06em] sm:text-8xl">
          BOOK
          <br />
          YOUR
          <br />
          <span className="italic text-white/30">
            SHOOT.
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-sm leading-7 text-white/40">
          Choose your service, provide your details and
          select your preferred date and time.
        </p>

      </section>

      {/* BOOKING FORM */}

      <section className="mx-auto max-w-7xl px-5 pb-32 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_380px]"
        >

          {/* LEFT */}

          <div className="space-y-10">

            {/* SERVICES */}

            <div className="border-y border-white/10 py-10">

              <div className="mb-6">

                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  01 / Select Service
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  CHOOSE A PACKAGE
                </h2>

              </div>

              {loadingPlans ? (
                <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/40">
                  Loading services...
                </div>
              ) : plans.length === 0 ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
                  No services are currently available.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">

                  {plans.map((plan) => {

                    const active =
                      selectedPlan === plan.id;

                    return (
                      <button
                        type="button"
                        key={plan.id}
                        onClick={() =>
                          setSelectedPlan(plan.id)
                        }
                        className={`text-left rounded-2xl border p-5 transition ${
                          active
                            ? "border-white bg-white text-black"
                            : "border-white/10 bg-white/[0.02] text-white hover:border-white/30"
                        }`}
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <p
                              className={`text-xs ${
                                active
                                  ? "text-black/40"
                                  : "text-white/25"
                              }`}
                            >
                              {String(plan.id).padStart(
                                2,
                                "0"
                              )}
                            </p>

                            <h3 className="mt-2 font-black">
                              {plan.name}
                            </h3>

                          </div>

                          <span className="font-bold">
                            ₹
                            {Number(
                              plan.price
                            ).toLocaleString("en-IN")}
                          </span>

                        </div>

                        {plan.description && (
                          <p
                            className={`mt-4 text-xs leading-5 ${
                              active
                                ? "text-black/50"
                                : "text-white/35"
                            }`}
                          >
                            {plan.description}
                          </p>
                        )}

                      </button>
                    );
                  })}

                </div>
              )}

            </div>

            {/* CUSTOMER DETAILS */}

            <div className="border-b border-white/10 pb-10">

              <div className="mb-6">

                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  02 / Your Details
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  CUSTOMER INFORMATION
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Full Name"
                  value={customerName}
                  onChange={setCustomerName}
                  placeholder="Your name"
                  required
                />

                <Field
                  label="Phone Number"
                  value={phone}
                  onChange={setPhone}
                  placeholder="9876543210"
                  type="tel"
                  required
                />

                <Field
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  type="email"
                  required
                />

                <Field
                  label="Location"
                  value={location}
                  onChange={setLocation}
                  placeholder="Bangalore"
                  required
                />

              </div>

            </div>

            {/* DATE */}

            <div className="border-b border-white/10 pb-10">

              <div className="mb-6">

                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  03 / Schedule
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  PICK A DATE
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                    Date
                  </label>

                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) =>
                      setBookingDate(e.target.value)
                    }
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none transition focus:border-white/40"
                    required
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                    Preferred Time
                  </label>

                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) =>
                      setBookingTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none transition focus:border-white/40"
                  />

                </div>

              </div>

            </div>

            {/* REQUIREMENTS */}

            <div>

              <div className="mb-6">

                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  04 / Requirements
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  TELL US MORE
                </h2>

              </div>

              <textarea
                value={requirements}
                onChange={(e) =>
                  setRequirements(e.target.value)
                }
                placeholder="Tell us about your project, ideas, location, style, references, etc."
                rows={7}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/40"
              />

            </div>

          </div>

          {/* RIGHT SUMMARY */}

          <aside className="lg:sticky lg:top-8 lg:h-fit">

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">

              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Booking Summary
              </p>

              <div className="mt-8 border-b border-white/10 pb-6">

                <p className="text-xs text-white/30">
                  Selected Service
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {selectedPlanData?.name ||
                    "Select a service"}
                </h3>

                {selectedPlanData?.description && (
                  <p className="mt-3 text-xs leading-5 text-white/35">
                    {selectedPlanData.description}
                  </p>
                )}

              </div>

              <div className="space-y-4 border-b border-white/10 py-6">

                <div className="flex justify-between text-sm">

                  <span className="text-white/40">
                    Service
                  </span>

                  <span>
                    {selectedPlanData
                      ? `₹${Number(
                          selectedPlanData.price
                        ).toLocaleString("en-IN")}`
                      : "—"}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-white/40">
                    Booking status
                  </span>

                  <span className="text-yellow-400">
                    Pending
                  </span>

                </div>

              </div>

              <div className="py-6">

                <div className="flex items-end justify-between">

                  <span className="text-sm text-white/40">
                    Total
                  </span>

                  <span className="text-3xl font-black">

                    {selectedPlanData
                      ? `₹${Number(
                          selectedPlanData.price
                        ).toLocaleString("en-IN")}`
                      : "₹0"}

                  </span>

                </div>

              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting || loadingPlans
                }
                className="w-full rounded-full bg-white px-6 py-4 text-sm font-black text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "CREATING BOOKING..."
                  : "CONTINUE TO PAYMENT →"}
              </button>

              <p className="mt-4 text-center text-[10px] leading-4 text-white/20">
                Your booking will be created with a
                pending payment status. Payment will be
                handled in the next step.
              </p>

            </div>

          </aside>

        </form>

      </section>

    </main>
  );
}

// --------------------------------------------------
// FIELD COMPONENT
// --------------------------------------------------

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/40"
      />

    </div>
  );
}