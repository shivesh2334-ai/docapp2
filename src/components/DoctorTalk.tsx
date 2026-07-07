"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function DoctorTalk({
  videoUrl,
  thumbnailUrl,
  title = "Doctor Talk",
}: {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!videoUrl) return null;

  return (
    <section className="mx-auto max-w-3xl px-5 py-8">
      <h2 className="font-serif text-xl font-semibold text-ink mb-4">{title}</h2>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-ink">
        {playing ? (
          <iframe
            src={videoUrl}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="focus-ring absolute inset-0 flex h-full w-full items-center justify-center"
            aria-label={`Play ${title} video`}
            style={
              thumbnailUrl
                ? { backgroundImage: `url(${thumbnailUrl})`, backgroundSize: "cover" }
                : undefined
            }
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 text-ink shadow-lg transition-transform hover:scale-105">
              <Play size={26} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
