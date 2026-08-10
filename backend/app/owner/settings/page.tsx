"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2, Save } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Settings = {
  businessName: string;
  email: string;
  phone: string;
  tagline: string;
  logoUrl: string;
};

export default function OwnerSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    businessName: "",
    email: "",
    phone: "",
    tagline: "",
    logoUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function getToken() {
    return localStorage.getItem("ownerToken");
  }

  function getFullImageUrl(url: string) {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${API_URL}${url}`;
  }

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(
          `${API_URL}/api/site-settings`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load settings"
          );
        }

        setSettings({
          businessName: data.settings.businessName || "",
          email: data.settings.email || "",
          phone: data.settings.phone || "",
          tagline: data.settings.tagline || "",
          logoUrl: data.settings.logoUrl || "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Logo must be smaller than 5MB.");
      return;
    }

    setSelectedFile(file);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  }

  async function uploadLogo() {
    if (!selectedFile) {
      return settings.logoUrl;
    }

    const token = getToken();

    if (!token) {
      window.location.href = "/owner/login";
      return "";
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("logo", selectedFile);

      const response = await fetch(
        `${API_URL}/api/uploads/logo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("ownerToken");
        window.location.href = "/owner/login";
        return "";
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Logo upload failed"
        );
      }

      const uploadedUrl = data.file?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Logo uploaded but no URL was returned."
        );
      }

      setSettings((current) => ({
        ...current,
        logoUrl: uploadedUrl,
      }));

      setSelectedFile(null);
      setPreviewUrl("");

      return uploadedUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Logo upload failed"
      );

      return "";
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        window.location.href = "/owner/login";
        return;
      }

      let logoUrl = settings.logoUrl;

      if (selectedFile) {
        logoUrl = await uploadLogo();

        if (!logoUrl) {
          return;
        }
      }

      const response = await fetch(
        `${API_URL}/api/site-settings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessName: settings.businessName,
            email: settings.email,
            phone: settings.phone,
            tagline: settings.tagline,
            logoUrl,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("ownerToken");
        window.location.href = "/owner/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save settings"
        );
      }

      setSettings({
        businessName: data.settings.businessName || "",
        email: data.settings.email || "",
        phone: data.settings.phone || "",
        tagline: data.settings.tagline || "",
        logoUrl: data.settings.logoUrl || "",
      });

      setMessage("Business settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  const displayedLogo =
    previewUrl || getFullImageUrl(settings.logoUrl);

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
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">

        {/* HEADER */}

        <div className="mb-10 flex items-center justify-between gap-5">
          <div>
            <Link
              href="/owner"
              className="mb-5 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Owner Dashboard
            </Link>

            <p className="text-xs uppercase tracking-[0.35em] text-white/30">
              SHY.VIZUALS
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
              BUSINESS SETTINGS
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage your business information and website logo.
            </p>
          </div>
        </div>

        {/* SUCCESS */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-300">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* LOGO */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Brand
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Business Logo
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Upload a JPG, PNG or WEBP image up to 5MB.
              </p>
            </div>

            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">

              {/* PREVIEW */}

              <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
                {displayedLogo ? (
                  <img
                    src={displayedLogo}
                    alt="Business logo"
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center text-white/20">
                    <ImagePlus
                      size={32}
                      className="mx-auto mb-2"
                    />
                    <span className="text-xs">
                      No logo
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="logo"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/80"
                >
                  <ImagePlus size={18} />
                  Select Image
                </label>

                <input
                  id="logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile && (
                  <p className="mt-4 text-sm text-white/50">
                    Selected:{" "}
                    <span className="text-white">
                      {selectedFile.name}
                    </span>
                  </p>
                )}

                <p className="mt-3 text-xs text-white/25">
                  Recommended: PNG with transparent background.
                </p>
              </div>
            </div>
          </section>

          {/* BUSINESS INFORMATION */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Information
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Business Information
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              {/* BUSINESS NAME */}

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Business Name
                </label>

                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessName: e.target.value,
                    })
                  }
                  placeholder="Shy.Vizuals"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-white/40"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Business Email
                </label>

                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: e.target.value,
                    })
                  }
                  placeholder="shyvizuals@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-white/40"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-white/40"
                />
              </div>

              {/* TAGLINE */}

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Tagline
                </label>

                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      tagline: e.target.value,
                    })
                  }
                  placeholder="Turning moments into cinematic stories."
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-white/40"
                />
              </div>
            </div>
          </section>

          {/* SAVE */}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving || uploading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  {uploading
                    ? "Uploading Logo..."
                    : "Saving..."}
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}