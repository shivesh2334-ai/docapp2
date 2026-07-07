"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function CallbackCard({ doctorId, email }: { doctorId: string; email?: string | null }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/callback-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, fullName: name, phone, whatsappOptIn: optIn }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not submit. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-8">
      <div className="rounded-xl bg-pine px-5 py-6 text-paper">
        <h2 className="font-serif text-lg font-semibold leading-snug">
          Get a callback from our health advisor
        </h2>

        {done ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-paper/15 px-4 py-3 text-sm">
            <CheckCircle2 size={18} />
            Thanks — we&apos;ll call you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              required
              type="tel"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="focus-ring w-full rounded-lg bg-paper px-3 py-3 text-sm text-ink placeholder:text-sage"
            />
            <input
              required
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus-ring w-full rounded-lg bg-paper px-3 py-3 text-sm text-ink placeholder:text-sage"
            />
            <button
              type="submit"
              disabled={submitting}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3.5 font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Submitting…" : "Submit"}
            </button>
            <label className="flex items-start gap-2 text-xs text-paper/85">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                className="mt-0.5 accent-paper"
              />
              Get updates on WhatsApp. I agree to the T&amp;C.
            </label>
            {error && <p className="text-xs text-rust-dark bg-paper/90 rounded px-2 py-1">{error}</p>}
            {email && <p className="text-xs text-paper/70">Email — {email}</p>}
            <p className="flex items-center gap-1.5 text-xs text-paper/70">
              We will never share your personal info
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
