"use client";

import { ArrowUp } from "lucide-react";

const QUICK_LINKS_LEFT = ["About us", "Leadership", "Careers", "Contact Us"];
const QUICK_LINKS_RIGHT = ["Emergency 24x7", "Feedback", "Blogs"];

const SOCIALS: { label: string; path: string }[] = [
  {
    label: "Facebook",
    path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.5.3v2.7h-1.7c-1.3 0-1.6.7-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z",
  },
  {
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5ZM17.5 6a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z",
  },
  {
    label: "YouTube",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.1 5 12 5 12 5s-6.1 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.9 19 12 19 12 19s6.1 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5 3Z",
  },
  {
    label: "LinkedIn",
    path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8.3 9.3H5.7V18h2.6Zm-1.3-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM18.3 18v-4.8c0-2.6-1.4-3.8-3.2-3.8a2.8 2.8 0 0 0-2.5 1.4V9.3H10v8.7h2.6v-4.8c0-1.3.6-2 1.7-2s1.5.8 1.5 2.1V18Z",
  },
];

export function SiteFooter({ clinicName }: { clinicName: string }) {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="space-y-3">
            {QUICK_LINKS_LEFT.map((l) => (
              <a key={l} href="#" className="focus-ring block text-paper/85 hover:text-paper">
                {l}
              </a>
            ))}
          </div>
          <div className="space-y-3">
            {QUICK_LINKS_RIGHT.map((l) => (
              <a key={l} href="#" className="focus-ring block text-paper/85 hover:text-paper">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-paper/60">Follow us</p>
            <div className="flex gap-2">
              {SOCIALS.map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-paper/30 hover:border-paper"
                  aria-label={label}
                >
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-pine"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>

        <div className="tear-divider mt-8 opacity-30" />
        <p className="mt-6 font-mono text-xs text-paper/50">
          {clinicName} · This template is for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
