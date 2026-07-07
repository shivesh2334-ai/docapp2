import { Share2 } from "lucide-react";
import type { Doctor } from "@/types/doctor";

export function DoctorHero({ doctor }: { doctor: Doctor }) {
  const initials = doctor.full_name
    .split(" ")
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <section className="mx-auto max-w-3xl px-5 pt-8" id="profile">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pine text-paper font-serif text-xl font-semibold sm:h-20 sm:w-20 sm:text-2xl"
            aria-hidden
          >
            {initials || "Dr"}
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage">
              {doctor.designation ?? "Consultant"}
            </p>
            <h1 className="font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              {doctor.full_name}
            </h1>
            <p className="mt-1 text-sm text-ink/70">{doctor.credentials}</p>
          </div>
        </div>
        <button
          className="focus-ring shrink-0 rounded-full border border-line p-2 text-sage hover:text-pine hover:border-pine transition-colors"
          aria-label="Share doctor profile"
        >
          <Share2 size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4">
        {doctor.specialties.map((s) => (
          <span
            key={s}
            className="rounded-full bg-card px-3 py-1 text-xs font-medium text-ink/80"
          >
            {s}
          </span>
        ))}
        {doctor.experience_years != null && (
          <span className="font-mono text-xs font-medium text-pine">
            {doctor.experience_years}+ yrs experience
          </span>
        )}
      </div>
    </section>
  );
}
