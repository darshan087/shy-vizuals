"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
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

export default function PaymentClient() {
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
      ? (amount * Number(settings.advanceValue)) / 100
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

      const uploadedUrl =
        uploadData.file?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Screenshot uploaded, but backend did not return the uploaded file URL."
        );
      }

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

          {/* OWNER / LOGO BUTTON → MAIN WEBSITE */}
          <Link
            href="/"
            className="block transition-opacity hover:opacity-70"
          >
            <div className="text-xl font-black tracking-[0.18em]">
              SHY.
            </div>

            <div className="text-[8px] tracking-[0.42em] text-white/40">
              VIZUALS
            </div>
          </Link>

          {/* ONLY BACK BUTTON */}
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
            Complete the advance payment using the UPI
            details below, then upload your payment
            screenshot.
          </p>

          {loadingSettings ? (
            <div className="mt-10 rounded-3xl border border-white/10 bg-black p-10 text-center text-sm text-white/40">
              Loading payment details...
            </div>
          ) : (
            <>
              {/* QR CODE */}
              <div className="mt-10 flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-black p-8">

                {settings?.qrImageUrl ? (
                  <Image
                    src={
                      settings.qrImageUrl.startsWith("http")
                        ? settings.qrImageUrl
                        : `${API_URL}${settings.qrImageUrl}`
                    }
                    alt="Payment QR Code"
                    width={256}
                    height={256}
                    unoptimized
                    className="h-64 w-64 rounded-xl object-contain"
                  />
                ) : (
                  <div className="text-center text-white/30">
                    No QR code available
                  </div>
                )}

              </div>

              {/* PAYMENT DETAILS */}
              <div className="mt-6 grid gap-3">

                {/* ADVANCE */}
                <div className="rounded-xl border border-white/10 px-4 py-3 text-sm">
                  <div className="text-xs text-white/40">
                    Advance Amount
                  </div>

                  <div className="mt-1 font-bold">
                    ₹
                    {Number(
                      advanceAmount || 0
                    ).toLocaleString("en-IN")}
                  </div>
                </div>

                {/* UPI */}
                <div className="rounded-xl border border-white/10 px-4 py-3 text-sm">
                  <div className="text-xs text-white/40">
                    UPI ID
                  </div>

                  <div className="mt-1 font-bold">
                    {settings?.upiId ||
                      "Not provided"}
                  </div>
                </div>

                {/* PAYMENT MESSAGE */}
                {settings?.paymentMessage && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/50">
                    {settings.paymentMessage}
                  </div>
                )}

                {/* SCREENSHOT */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                    Upload Payment Screenshot
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="w-full rounded-xl border border-white/10 bg-black p-3 text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold file:text-black"
                  />

                  {file && (
                    <p className="mt-2 text-xs text-green-300">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <div>
                  <button
                    onClick={submitPayment}
                    disabled={uploading}
                    className="w-full rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading
                      ? "UPLOADING..."
                      : "SUBMIT PAYMENT"}
                  </button>
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
                    Payment submitted successfully.
                  </div>
                )}

              </div>
            </>
          )}
        </div>

        {/* SUMMARY */}
        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">

          <p className="text-xs uppercase tracking-[0.3em] text-white/30">
            Summary
          </p>

          <h3 className="mt-2 font-bold">
            Booking
          </h3>

          <div className="mt-4 text-sm text-white/40">

            <div>
              Booking Number:{" "}
              {bookingNumber || "-"}
            </div>

            <div className="mt-2">
              Amount: ₹
              {Number(
                amount || 0
              ).toLocaleString("en-IN")}
            </div>

          </div>
        </aside>

      </section>
    </main>
  );
}