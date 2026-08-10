"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PaymentSettings = {
  id: number;
  upiId: string | null;
  qrImageUrl: string | null;
  advanceType: "FIXED" | "PERCENTAGE";
  advanceValue: string;
  paymentMessage: string | null;
};

export default function PaymentPage() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const bookingNumber = searchParams.get("bookingNumber");
  const amount = Number(searchParams.get("amount") || 0);

  const [settings, setSettings] =
    useState<PaymentSettings | null>(null);

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [file, setFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPaymentSettings() {
      try {
        setLoadingSettings(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/payment-settings`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error(
            `Payment settings API returned ${response.status} instead of JSON. Check that your backend is running on ${API_URL}.`
          );
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load payment settings."
          );
        }

        setSettings(data.settings);
      } catch (err) {
        console.error(
          "Payment settings error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load payment settings."
        );
      } finally {
        setLoadingSettings(false);
      }
    }

    loadPaymentSettings();
  }, []);

  const advanceAmount = settings
    ? settings.advanceType === "PERCENTAGE"
      ? (amount *
          Number(settings.advanceValue)) /
        100
      : Number(settings.advanceValue)
    : 0;

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");
    setSuccess(false);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);

      setError(
        "Please upload a JPG, PNG or WEBP image."
      );

      return;
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      setFile(null);

      setError(
        "Image must be smaller than 10MB."
      );

      return;
    }

    setFile(selectedFile);
  }

  async function submitPayment() {
    if (!bookingId) {
      setError(
        "Booking information is missing."
      );
      return;
    }

    if (!file) {
      setError(
        "Please upload your payment screenshot."
      );
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      /*
       * STEP 1
       * Upload screenshot to backend
       */

      const formData = new FormData();

      formData.append(
        "screenshot",
        file
      );

      const uploadResponse =
        await fetch(
          `${API_URL}/api/uploads/payment-screenshot`,
          {
            method: "POST",
            body: formData,
          }
        );

      const uploadContentType =
        uploadResponse.headers.get(
          "content-type"
        ) || "";

      if (
        !uploadContentType.includes(
          "application/json"
        )
      ) {
        throw new Error(
          `Screenshot upload API returned ${uploadResponse.status} instead of JSON. Make sure the backend upload route exists.`
        );
      }

      const uploadData =
        await uploadResponse.json();

      if (
        !uploadResponse.ok ||
        !uploadData.success
      ) {
        throw new Error(
          uploadData.message ||
            "Payment screenshot upload failed."
        );
      }

      /*
       * Backend should return:
       *
       * file: {
       *   url: "/uploads/payments/..."
       * }
       */

      const uploadedUrl =
        uploadData.file?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Screenshot uploaded, but backend did not return the uploaded file URL."
        );
      }

      /*
       * STEP 2
       * Attach uploaded screenshot URL
       * to the booking.
       */

      const attachResponse =
        await fetch(
          `${API_URL}/api/bookings/${bookingId}/payment-screenshot`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              paymentScreenshot:
                uploadedUrl,
            }),
          }
        );

      const attachContentType =
        attachResponse.headers.get(
          "content-type"
        ) || "";

      if (
        !attachContentType.includes(
          "application/json"
        )
      ) {
        throw new Error(
          `Booking payment API returned ${attachResponse.status} instead of JSON. Check the backend booking route.`
        );
      }

      const attachData =
        await attachResponse.json();

      if (
        !attachResponse.ok ||
        !attachData.success
      ) {
        throw new Error(
          attachData.message ||
            "Unable to attach payment screenshot to booking."
        );
      }

      /*
       * SUCCESS
       */

      setSuccess(true);

      setFile(null);
    } catch (err) {
      console.error(
        "Payment submission error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit payment proof."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-black">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          <Link
            href="/"
            className="block"
          >
            <div className="text-xl font-black tracking-[0.18em]">
              SHY.
            </div>

            <div className="text-[8px] tracking-[0.42em] text-white/40">
              VIZUALS
            </div>
          </Link>

          <Link
            href="/booking"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Back to Booking
          </Link>

        </div>
      </nav>

      {/* HEADER */}

      <section className="mx-auto max-w-5xl px-5 pb-10 pt-20 lg:px-8">

        <p className="text-xs uppercase tracking-[0.35em] text-white/30">
          Final Step
        </p>

        <h1 className="mt-5 text-6xl font-black leading-[0.85] tracking-[-0.06em] sm:text-8xl">
          SECURE
          <br />
          YOUR
          <br />

          <span className="italic text-white/30">
            DATE.
          </span>
        </h1>

      </section>

      {/* MAIN */}

      <section className="mx-auto grid max-w-5xl gap-8 px-5 pb-32 lg:grid-cols-[1fr_360px] lg:px-8">

        {/* PAYMENT CARD */}

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-10">

          <p className="text-xs uppercase tracking-[0.3em] text-white/30">
            01 / Payment
          </p>

          <h2 className="mt-3 text-3xl font-black">
            PAY YOUR ADVANCE
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-white/40">
            Complete the advance payment using the
            UPI details below, then upload your
            payment screenshot.
          </p>

          {/* PAYMENT SETTINGS */}

          {loadingSettings ? (
            <div className="mt-10 rounded-3xl border border-white/10 bg-black p-10 text-center text-sm text-white/40">
              Loading payment details...
            </div>
          ) : (
            <>
              {/* QR */}

              <div className="mt-10 flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-black p-8">

                {settings?.qrImageUrl ? (
                  <img
                    src={settings.qrImageUrl}
                    alt="Payment QR Code"
                    className="h-64 w-64 rounded-xl object-contain"
                  />
                ) : (
                  <div className="text-center">

                    <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">

                      <span className="text-xs text-white/20">
                        QR NOT AVAILABLE
                      </span>

                    </div>

                  </div>
                )}

              </div>

              {/* UPI */}

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
                  UPI ID
                </p>

                <p className="mt-2 text-xl font-bold">
                  {settings?.upiId ||
                    "Not configured"}
                </p>

              </div>

              {/* ADVANCE */}

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
                      Advance Required
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      ₹
                      {advanceAmount.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>

                  </div>

                  <div className="rounded-full bg-white/10 px-4 py-2 text-xs">

                    {settings?.advanceType ===
                    "PERCENTAGE"
                      ? `${settings.advanceValue}%`
                      : "Fixed"}

                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              {settings?.paymentMessage && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-6 text-white/50">
                  {settings.paymentMessage}
                </div>
              )}

            </>
          )}

          {/* SCREENSHOT */}

          <div className="mt-10">

            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              02 / Proof
            </p>

            <h3 className="mt-3 text-2xl font-black">
              PAYMENT SCREENSHOT
            </h3>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center transition hover:border-white/30">

              <span className="text-3xl">
                ↑
              </span>

              <span className="mt-4 text-sm font-bold">
                {file
                  ? file.name
                  : "Choose payment screenshot"}
              </span>

              <span className="mt-2 text-xs text-white/25">
                JPG, PNG or WEBP • Maximum 10MB
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">

              <p className="font-semibold">
                Payment proof submitted successfully ✓
              </p>

              <p className="mt-1 text-green-300/70">
                Your payment screenshot has been
                attached to booking{" "}
                {bookingNumber || bookingId}.
                The Shy.Vizuals owner can now
                review it.
              </p>

            </div>
          )}

          {/* SUBMIT */}

          <button
            type="button"
            onClick={submitPayment}
            disabled={
              uploading ||
              success ||
              loadingSettings
            }
            className="mt-6 w-full rounded-full bg-white px-6 py-4 text-sm font-black text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "UPLOADING..."
              : success
              ? "PAYMENT SUBMITTED ✓"
              : "SUBMIT PAYMENT PROOF →"}
          </button>

        </div>

        {/* SUMMARY */}

        <aside className="lg:sticky lg:top-8 lg:h-fit">

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">

            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              Booking Summary
            </p>

            <div className="mt-8 border-b border-white/10 pb-6">

              <p className="text-xs text-white/30">
                Booking Number
              </p>

              <p className="mt-2 break-all text-xl font-black">
                {bookingNumber ||
                  "Not provided"}
              </p>

            </div>

            <div className="space-y-4 border-b border-white/10 py-6">

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/40">
                  Booking ID
                </span>

                <span>
                  {bookingId || "—"}
                </span>

              </div>

              <div className="flex justify-between gap-4 text-sm">

                <span className="text-white/40">
                  Status
                </span>

                <span className="text-yellow-400">
                  Pending
                </span>

              </div>

            </div>

            <div className="py-6">

              <p className="text-sm text-white/40">
                Total Amount
              </p>

              <p className="mt-2 text-4xl font-black">
                ₹
                {amount.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

              <p className="mt-2 text-xs text-white/25">
                Advance: ₹
                {advanceAmount.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

            </div>

            <div className="rounded-xl bg-white/[0.03] p-4 text-xs leading-5 text-white/30">

              Your booking will remain pending until
              the payment proof is reviewed and
              approved by the Shy.Vizuals owner.

            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}