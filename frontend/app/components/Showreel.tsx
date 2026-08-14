"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type Media = {
  id: number;
  title: string;
  description: string | null;
  mediaType: "IMAGE" | "VIDEO";
  fileUrl: string;
  thumbnailUrl: string | null;
  createdAt: string;
};

export default function Showreel() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      const response = await fetch(
        `${API_URL}/api/media`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMedia(data.media || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function mediaUrl(url: string) {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${API_URL}${url}`;
  }

  return (
    <section
      id="showreel"
      className="border-y border-white/10 bg-[#090909]"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

        <div className="mb-14">

          <p className="text-xs uppercase tracking-[0.35em] text-white/30">
            Selected Work
          </p>

          <h2 className="mt-3 text-5xl font-black tracking-[-0.04em] sm:text-7xl">
            THE SHOWREEL
          </h2>

        </div>

        {loading ? (

          <div className="py-24 text-center text-white/40">
            Loading Showreel...
          </div>

        ) : media.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-white/10 p-20 text-center">

            <h3 className="text-3xl font-bold">
              No Media Uploaded
            </h3>

            <p className="mt-4 text-white/40">
              Upload images or videos from
              the Owner Panel.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {media.map((item) => (

              <div
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] transition hover:border-white/25"
              >

                <div className="relative aspect-video overflow-hidden">

                  {item.mediaType === "IMAGE" ? (

                    <Image
                      src={mediaUrl(item.fileUrl)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  ) : (

                    <video
                      controls
                      preload="metadata"
                      poster={
                        item.thumbnailUrl
                          ? mediaUrl(item.thumbnailUrl)
                          : undefined
                      }
                      className="h-full w-full object-cover"
                    >
                      <source
                        src={mediaUrl(item.fileUrl)}
                        type="video/mp4"
                      />
                    </video>

                  )}

                  <div className="absolute left-4 top-4">

                    <span className="rounded-full bg-black/70 px-3 py-1 text-[10px] font-black tracking-wider">

                      {item.mediaType}

                    </span>

                  </div>

                </div>

                <div className="p-6">

                  <h3 className="text-xl font-black">
                    {item.title}
                  </h3>

                  {item.description && (

                    <p className="mt-3 text-sm leading-6 text-white/45">
                      {item.description}
                    </p>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}