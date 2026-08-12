"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  Loader2,
  Image as ImageIcon,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import OwnerNavbar from "@/app/components/navbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type SiteSettings = {
  id?: number;
  businessName: string;
  email: string;
  phone: string;
  tagline: string | null;
  logoUrl: string | null;
};

type PaymentSettings = {
  id?: number;
  upiId: string | null;
  qrImageUrl: string | null;
  advanceType: "FIXED" | "PERCENTAGE";
  advanceValue: string | number;
  paymentMessage: string | null;
};

export default function OwnerSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<SiteSettings>({
      businessName: "",
      email: "",
      phone: "",
      tagline: "",
      logoUrl: null,
    });

  const [paymentSettings, setPaymentSettings] =
    useState<PaymentSettings>({
      upiId: "",
      qrImageUrl: null,
      advanceType: "PERCENTAGE",
      advanceValue: 30,
      paymentMessage:
        "Pay the advance amount to confirm your booking.",
    });

  const [loading, setLoading] = useState(true);
  const [savingBusiness, setSavingBusiness] =
    useState(false);
  const [savingPayment, setSavingPayment] =
    useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [uploadingQr, setUploadingQr] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAllSettings();
  }, []);

  async function loadAllSettings() {
    try {
      setLoading(true);
      setError("");

      const [siteResponse, paymentResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/site-settings`, {
            cache: "no-store",
          }),

          fetch(
            `${API_URL}/api/payment-settings`,
            {
              cache: "no-store",
            }
          ),
        ]);

      const siteData =
        await siteResponse.json();

      const paymentData =
        await paymentResponse.json();

      if (
        !siteResponse.ok ||
        !siteData.success
      ) {
        throw new Error(
          siteData.message ||
            "Failed to load business settings"
        );
      }

      if (
        !paymentResponse.ok ||
        !paymentData.success
      ) {
        throw new Error(
          paymentData.message ||
            "Failed to load payment settings"
        );
      }

      setSettings({
        id: siteData.settings.id,
        businessName:
          siteData.settings.businessName || "",
        email:
          siteData.settings.email || "",
        phone:
          siteData.settings.phone || "",
        tagline:
          siteData.settings.tagline || "",
        logoUrl:
          siteData.settings.logoUrl || null,
      });

      setPaymentSettings({
        id: paymentData.settings.id,
        upiId:
          paymentData.settings.upiId || "",
        qrImageUrl:
          paymentData.settings.qrImageUrl ||
          null,
        advanceType:
          paymentData.settings.advanceType ||
          "PERCENTAGE",
        advanceValue:
          paymentData.settings.advanceValue ??
          30,
        paymentMessage:
          paymentData.settings.paymentMessage ||
          "",
      });
    } catch (err) {
      console.error(
        "Load settings error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");
    setUploadingLogo(true);

    try {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Only PNG, JPG and WEBP images are allowed."
        );
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        throw new Error(
          "Logo image must be smaller than 5 MB."
        );
      }

      const token =
        localStorage.getItem(
          "ownerToken"
        );

      if (!token) {
        router.replace(
          "/owner/login"
        );
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "logo",
        file
      );

      const response =
        await fetch(
          `${API_URL}/api/uploads/logo`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Logo upload failed"
        );
      }

      setSettings(
        (current) => ({
          ...current,
          logoUrl:
            data.file.url,
        })
      );

      setMessage(
        "Logo uploaded. Click Save Business Settings."
      );
    } catch (err) {
      console.error(
        "Logo upload error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Logo upload failed"
      );
    } finally {
      setUploadingLogo(false);
      event.target.value = "";
    }
  }

  async function handleQrUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");
    setUploadingQr(true);

    try {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Only PNG, JPG and WEBP images are allowed."
        );
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        throw new Error(
          "QR image must be smaller than 5 MB."
        );
      }

      const token =
        localStorage.getItem(
          "ownerToken"
        );

      if (!token) {
        router.replace(
          "/owner/login"
        );
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "qr",
        file
      );

      const response =
        await fetch(
          `${API_URL}/api/uploads/payment-qr`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "QR upload failed"
        );
      }

      setPaymentSettings(
        (current) => ({
          ...current,
          qrImageUrl:
            data.file.url,
        })
      );

      setMessage(
        "QR uploaded. Click Save Payment Settings."
      );
    } catch (err) {
      console.error(
        "QR upload error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "QR upload failed"
      );
    } finally {
      setUploadingQr(false);
      event.target.value = "";
    }
  }

  async function saveBusinessSettings(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setSavingBusiness(true);

    try {
      const token =
        localStorage.getItem(
          "ownerToken"
        );

      if (!token) {
        router.replace(
          "/owner/login"
        );
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/site-settings`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              businessName:
                settings.businessName,
              email:
                settings.email,
              phone:
                settings.phone,
              tagline:
                settings.tagline,
              logoUrl:
                settings.logoUrl,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to save business settings"
        );
      }

      setSettings({
        id: data.settings.id,
        businessName:
          data.settings.businessName ||
          "",
        email:
          data.settings.email || "",
        phone:
          data.settings.phone || "",
        tagline:
          data.settings.tagline || "",
        logoUrl:
          data.settings.logoUrl ||
          null,
      });

      setMessage(
        "Business settings saved successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save business settings"
      );
    } finally {
      setSavingBusiness(false);
    }
  }

  async function savePaymentSettings(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setSavingPayment(true);

    try {
      const token =
        localStorage.getItem(
          "ownerToken"
        );

      if (!token) {
        router.replace(
          "/owner/login"
        );
        return;
      }

      if (
        !paymentSettings.advanceValue &&
        paymentSettings.advanceValue !== 0
      ) {
        throw new Error(
          "Please enter an advance amount."
        );
      }

      const value = Number(
        paymentSettings.advanceValue
      );

      if (
        !Number.isFinite(value) ||
        value < 0
      ) {
        throw new Error(
          "Advance amount must be a valid number."
        );
      }

      if (
        paymentSettings.advanceType ===
          "PERCENTAGE" &&
        value > 100
      ) {
        throw new Error(
          "Percentage cannot be greater than 100."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/payment-settings`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              upiId:
                paymentSettings.upiId,
              qrImageUrl:
                paymentSettings.qrImageUrl,
              advanceType:
                paymentSettings.advanceType,
              advanceValue:
                value,
              paymentMessage:
                paymentSettings.paymentMessage,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to save payment settings"
        );
      }

      setPaymentSettings({
        id: data.settings.id,
        upiId:
          data.settings.upiId || "",
        qrImageUrl:
          data.settings.qrImageUrl ||
          null,
        advanceType:
          data.settings.advanceType,
        advanceValue:
          data.settings.advanceValue,
        paymentMessage:
          data.settings.paymentMessage ||
          "",
      });

      setMessage(
        "Payment settings saved successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save payment settings"
      );
    } finally {
      setSavingPayment(false);
    }
  }

  const logoPreview =
    settings.logoUrl
      ? settings.logoUrl.startsWith(
          "http"
        )
        ? settings.logoUrl
        : `${API_URL}${settings.logoUrl}`
      : "";

  const qrPreview =
    paymentSettings.qrImageUrl
      ? paymentSettings.qrImageUrl.startsWith(
          "http"
        )
        ? paymentSettings.qrImageUrl
        : `${API_URL}${paymentSettings.qrImageUrl}`
      : "";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex items-center gap-3 text-white/50">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading settings...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">

     <OwnerNavbar/>
      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-300">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* BUSINESS SETTINGS */}

        <form
          onSubmit={saveBusinessSettings}
          className="grid gap-8 lg:grid-cols-[1fr_360px]"
        >

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">

            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              General
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Business Information
            </h2>

            <p className="mt-2 text-sm text-white/35">
              Update the information shown across your website.
            </p>

            <div className="mt-8 space-y-6">

              <Input
                label="Business Name"
                value={settings.businessName}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    businessName:
                      value,
                  })
                }
                placeholder="Shy.Vizuals"
              />

              <Input
                label="Business Email"
                type="email"
                value={settings.email}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    email: value,
                  })
                }
                placeholder="shyvizuals@gmail.com"
              />

              <Input
                label="Phone Number"
                value={settings.phone}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    phone: value,
                  })
                }
                placeholder="+91 XXXXX XXXXX"
              />

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Tagline
                </label>

                <textarea
                  value={
                    settings.tagline || ""
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      tagline:
                        e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Turning moments into cinematic stories."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-white/40"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={savingBusiness}
              className="mt-8 flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-black transition hover:bg-white/80 disabled:opacity-50"
            >
              {savingBusiness ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Business Settings
                </>
              )}
            </button>
          </div>

          {/* LOGO */}

          <div className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">

            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              Branding
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Business Logo
            </h2>

            <div className="mt-6 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">

              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Business logo"
                  className="max-h-full max-w-full object-contain p-8"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/20">
                  <ImageIcon size={48} />
                  <span className="text-sm">
                    No logo uploaded
                  </span>
                </div>
              )}

            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-4 text-sm font-bold transition hover:border-white/40 hover:bg-white hover:text-black">

              {uploadingLogo ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Change Logo
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleLogoUpload
                }
                disabled={uploadingLogo}
                className="hidden"
              />
            </label>

          </div>
        </form>

        {/* PAYMENT SETTINGS */}

        <form
          onSubmit={savePaymentSettings}
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
        >

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <CreditCard size={22} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  Payments
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Payment Settings
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  Customers will see these payment details when they make a booking.
                </p>
              </div>

            </div>

            <div className="mt-8 space-y-6">

              {/* UPI ID */}

              <Input
                label="UPI ID"
                value={
                  paymentSettings.upiId ||
                  ""
                }
                onChange={(value) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    upiId: value,
                  })
                }
                placeholder="yourname@upi"
              />

              <p className="-mt-3 text-xs text-white/25">
                Example: shyvizuals@upi
              </p>

              {/* ADVANCE TYPE */}

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Advance Payment Type
                </label>

                <select
                  value={
                    paymentSettings.advanceType
                  }
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      advanceType:
                        e.target.value as
                          | "FIXED"
                          | "PERCENTAGE",
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-white/40"
                >
                  <option value="PERCENTAGE">
                    Percentage
                  </option>

                  <option value="FIXED">
                    Fixed Amount
                  </option>
                </select>
              </div>

              {/* ADVANCE VALUE */}

              <Input
                label={
                  paymentSettings.advanceType ===
                  "PERCENTAGE"
                    ? "Advance Percentage (%)"
                    : "Advance Amount (₹)"
                }
                type="number"
                value={
                  String(
                    paymentSettings.advanceValue
                  )
                }
                onChange={(value) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    advanceValue:
                      value,
                  })
                }
                placeholder={
                  paymentSettings.advanceType ===
                  "PERCENTAGE"
                    ? "30"
                    : "1000"
                }
              />

              {/* MESSAGE */}

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Payment Message
                </label>

                <textarea
                  value={
                    paymentSettings.paymentMessage ||
                    ""
                  }
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      paymentMessage:
                        e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Pay the advance amount to confirm your booking."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-white/40"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={savingPayment}
              className="mt-8 flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-black transition hover:bg-white/80 disabled:opacity-50"
            >
              {savingPayment ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Payment Settings
                </>
              )}
            </button>

          </div>

          {/* QR CODE */}

          <div className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">

            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              UPI Payment
            </p>

            <h2 className="mt-2 text-2xl font-black">
              QR Scanner
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Upload the UPI QR code that customers should scan to pay.
            </p>

            <div className="mt-6 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white">

              {qrPreview ? (
                <img
                  src={qrPreview}
                  alt="UPI payment QR code"
                  className="h-full w-full object-contain p-5"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-black/30">
                  <ImageIcon size={50} />

                  <span className="text-sm">
                    No QR uploaded
                  </span>
                </div>
              )}

            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-4 text-sm font-bold transition hover:border-white/40 hover:bg-white hover:text-black">

              {uploadingQr ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Uploading QR...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  {qrPreview
                    ? "Change QR Scanner"
                    : "Upload QR Scanner"}
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleQrUpload
                }
                disabled={uploadingQr}
                className="hidden"
              />
            </label>

            <p className="mt-4 text-center text-xs leading-5 text-white/25">
              PNG, JPG or WEBP
              <br />
              Maximum size: 5 MB
            </p>

          </div>

        </form>

      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/50">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-white/40"
      />
    </div>
  );
}