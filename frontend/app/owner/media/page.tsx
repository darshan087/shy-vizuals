"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Media = {
  id: number;
  title: string;
  description: string | null;
  mediaType: "IMAGE" | "VIDEO";
  fileUrl: string;
  thumbnailUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function ManageMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] =
    useState<"IMAGE" | "VIDEO">("IMAGE");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editThumbnail, setEditThumbnail] =
    useState("");

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  function getToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("ownerToken") ||
      localStorage.getItem("accessToken")
    );
  }

  function authHeaders() {
    const token = getToken();

    if (!token) {
      return undefined;
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // --------------------------------------------------
  // LOAD MEDIA
  // --------------------------------------------------

  async function loadMedia() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/media/owner`,
        {
          method: "GET",
          headers: authHeaders(),
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load media."
        );
      }

      setMedia(data.media || []);
    } catch (err) {
      console.error("Load media error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load media."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  // --------------------------------------------------
  // FILE SELECT
  // --------------------------------------------------

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);

      setError(
        "Only JPG, PNG, WEBP, MP4, WEBM and MOV files are allowed."
      );

      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setFile(null);

      setError(
        "Media file must be smaller than 100MB."
      );

      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith("video/")) {
      setMediaType("VIDEO");
    } else {
      setMediaType("IMAGE");
    }
  }

  // --------------------------------------------------
  // UPLOAD
  // --------------------------------------------------

  async function uploadMedia(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!file) {
      setError("Please select an image or video.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found. Please login again."
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append(
        "description",
        description.trim()
      );
      formData.append("mediaType", mediaType);
      formData.append(
        "thumbnailUrl",
        thumbnailUrl.trim()
      );
      formData.append("media", file);

      const response = await fetch(
        `${API_URL}/api/media/owner`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Media upload failed."
        );
      }

      setSuccess(
        "Media uploaded successfully."
      );

      setTitle("");
      setDescription("");
      setThumbnailUrl("");
      setMediaType("IMAGE");
      setFile(null);

      const input =
        document.getElementById(
          "media-file"
        ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      await loadMedia();
    } catch (err) {
      console.error("Upload media error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Media upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function startEditing(item: Media) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(
      item.description || ""
    );
    setEditThumbnail(
      item.thumbnailUrl || ""
    );

    setError("");
    setSuccess("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditThumbnail("");
  }

  async function saveEdit(id: number) {
    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found."
      );
      return;
    }

    if (!editTitle.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/media/owner/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle.trim(),
            description:
              editDescription.trim(),
            thumbnailUrl:
              editThumbnail.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update media."
        );
      }

      setSuccess(
        "Media updated successfully."
      );

      cancelEditing();

      await loadMedia();
    } catch (err) {
      console.error("Update media error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update media."
      );
    }
  }

  // --------------------------------------------------
  // TOGGLE
  // --------------------------------------------------

  async function toggleMedia(id: number) {
    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/media/owner/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to change media status."
        );
      }

      setSuccess(data.message);

      await loadMedia();
    } catch (err) {
      console.error("Toggle media error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to change media status."
      );
    }
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function deleteMedia(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this media?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/media/owner/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete media."
        );
      }

      setSuccess(
        "Media deleted successfully."
      );

      await loadMedia();
    } catch (err) {
      console.error("Delete media error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete media."
      );
    }
  }

  // --------------------------------------------------
  // MEDIA URL
  // --------------------------------------------------

  function mediaUrl(url: string) {
    if (!url) {
      return "";
    }

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `${API_URL}${url}`;
  }

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  function formatDate(date: string) {
    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-black">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          <Link href="/" className="block">
            <div className="text-xl font-black tracking-[0.18em]">
              SHY.
            </div>

            <div className="text-[8px] tracking-[0.42em] text-white/40">
              VIZUALS
            </div>
          </Link>

          <Link
            href="/owner"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold transition hover:border-white/30 hover:bg-white hover:text-black"
          >
            ← OWNER DASHBOARD
          </Link>

        </div>
      </nav>

      {/* PAGE */}

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/30">
            Owner Panel
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-[-0.05em] sm:text-7xl">
            MEDIA
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
            Upload and manage the images and videos
            displayed on your Shy.Vizuals website.
          </p>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* UPLOAD FORM */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              Add New
            </p>

            <h2 className="mt-2 text-2xl font-black">
              UPLOAD MEDIA
            </h2>
          </div>

          <form
            onSubmit={uploadMedia}
            className="grid gap-6 lg:grid-cols-2"
          >

            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Example: BMW Delivery Reel"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={5}
                  placeholder="Describe this project..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                  Media Type
                </label>

                <select
                  value={mediaType}
                  onChange={(e) =>
                    setMediaType(
                      e.target.value as
                        | "IMAGE"
                        | "VIDEO"
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none"
                >
                  <option value="IMAGE">
                    IMAGE
                  </option>

                  <option value="VIDEO">
                    VIDEO
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                  Thumbnail URL
                </label>

                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) =>
                    setThumbnailUrl(e.target.value)
                  }
                  placeholder="Optional thumbnail URL"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

            </div>

            <div className="flex flex-col">

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                Media File
              </label>

              <label
                htmlFor="media-file"
                className="flex min-h-[280px] cursor-pointer flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black p-8 text-center transition hover:border-white/30 hover:bg-white/[0.02]"
              >
                <div className="text-5xl">
                  {file
                    ? mediaType === "VIDEO"
                      ? "🎬"
                      : "🖼️"
                    : "＋"}
                </div>

                <p className="mt-5 font-bold">
                  {file
                    ? file.name
                    : "Choose image or video"}
                </p>

                <p className="mt-2 text-xs text-white/30">
                  JPG, PNG, WEBP, MP4, WEBM or MOV
                </p>

                <p className="mt-1 text-xs text-white/20">
                  Maximum 100MB
                </p>

                <input
                  id="media-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={uploading}
                className="mt-5 w-full rounded-full bg-white px-6 py-4 text-sm font-black text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "UPLOADING..."
                  : "UPLOAD MEDIA →"}
              </button>

            </div>

          </form>
        </section>

        {/* MEDIA LIST */}

        <section className="mt-16">

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Library
              </p>

              <h2 className="mt-2 text-3xl font-black">
                YOUR MEDIA
              </h2>
            </div>

            <div className="text-sm text-white/30">
              {media.length} item
              {media.length === 1 ? "" : "s"}
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center text-sm text-white/40">
              Loading media...
            </div>
          ) : media.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-lg font-bold">
                No media uploaded yet.
              </p>

              <p className="mt-2 text-sm text-white/30">
                Upload your first image or video above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

              {media.map((item) => (
                <article
                  key={item.id}
                  className={`overflow-hidden rounded-3xl border ${
                    item.isActive
                      ? "border-white/10"
                      : "border-red-500/20"
                  } bg-[#0b0b0b]`}
                >

                  {/* PREVIEW */}

                  <div className="relative aspect-video overflow-hidden bg-[#111]">

                    {item.mediaType === "VIDEO" ? (
                      <video
                        src={mediaUrl(item.fileUrl)}
                        poster={
                          item.thumbnailUrl
                            ? mediaUrl(
                                item.thumbnailUrl
                              )
                            : undefined
                        }
                        controls
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={mediaUrl(item.fileUrl)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}

                    <div className="absolute left-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black ${
                          item.isActive
                            ? "bg-green-500/90 text-black"
                            : "bg-red-500/90 text-white"
                        }`}
                      >
                        {item.isActive
                          ? "ACTIVE"
                          : "HIDDEN"}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-black/70 px-3 py-1 text-[10px] font-black text-white">
                        {item.mediaType}
                      </span>
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    {editingId === item.id ? (
                      <div className="space-y-4">

                        <input
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(
                              e.target.value
                            )
                          }
                          placeholder="Title"
                          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                        />

                        <textarea
                          value={editDescription}
                          onChange={(e) =>
                            setEditDescription(
                              e.target.value
                            )
                          }
                          rows={4}
                          placeholder="Description"
                          className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                        />

                        <input
                          value={editThumbnail}
                          onChange={(e) =>
                            setEditThumbnail(
                              e.target.value
                            )
                          }
                          placeholder="Thumbnail URL"
                          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                        />

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              saveEdit(item.id)
                            }
                            className="flex-1 rounded-full bg-white px-4 py-3 text-xs font-black text-black transition hover:bg-white/80"
                          >
                            SAVE
                          </button>

                          <button
                            type="button"
                            onClick={
                              cancelEditing
                            }
                            className="rounded-full border border-white/10 px-4 py-3 text-xs font-bold transition hover:border-white/30"
                          >
                            CANCEL
                          </button>

                        </div>

                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-black">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-[11px] text-white/25">
                              {formatDate(
                                item.createdAt
                              )}
                            </p>
                          </div>

                        </div>

                        {item.description && (
                          <p className="mt-3 line-clamp-3 text-sm leading-5 text-white/40">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-5 grid grid-cols-3 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(item)
                            }
                            className="rounded-xl border border-white/10 px-3 py-3 text-xs font-bold transition hover:border-white/30 hover:bg-white/[0.03]"
                          >
                            EDIT
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleMedia(item.id)
                            }
                            className="rounded-xl border border-white/10 px-3 py-3 text-xs font-bold transition hover:border-white/30 hover:bg-white/[0.03]"
                          >
                            {item.isActive
                              ? "HIDE"
                              : "SHOW"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteMedia(item.id)
                            }
                            className="rounded-xl border border-red-500/20 px-3 py-3 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
                          >
                            DELETE
                          </button>

                        </div>
                      </>
                    )}

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </section>

    </main>
  );
}