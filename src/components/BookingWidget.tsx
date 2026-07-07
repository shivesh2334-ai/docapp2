"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { AppointmentSlot, Clinic } from "@/types/doctor";

interface BookingWidgetProps {
  doctorId: string;
  clinics: Clinic[];
  id?: string;
}

interface BookedAppointment {
  id: string;
  token_number: number;
  patient_name: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatMonth(d: Date) {
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function BookingWidget({ doctorId, clinics, id }: BookingWidgetProps) {
  const [clinicId, setClinicId] = useState<string>(clinics[0]?.id ?? "");
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<BookedAppointment | null>(null);

  useEffect(() => {
    if (!clinicId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/slots?doctorId=${doctorId}&clinicId=${clinicId}&month=${monthKey(viewDate)}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setError("Could not load availability. Please try again."))
      .finally(() => setLoading(false));
  }, [doctorId, clinicId, viewDate]);

  const slotsByDate = useMemo(() => {
    const map: Record<string, AppointmentSlot[]> = {};
    for (const s of slots) {
      if (!map[s.slot_date]) map[s.slot_date] = [];
      map[s.slot_date].push(s);
    }
    return map;
  }, [slots]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewDate]);

  function dateKey(day: number) {
    return `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const availableSlotsForSelectedDate = selectedDate
    ? (slotsByDate[selectedDate] ?? []).filter((s) => !s.is_booked)
    : [];

  async function handleConfirm(formData: { name: string; phone: string; reason: string }) {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          doctorId,
          clinicId,
          patientName: formData.name,
          patientPhone: formData.phone,
          reason: formData.reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try a different slot.");
        setSlots((prev) =>
          prev.map((s) => (s.id === selectedSlot.id ? { ...s, is_booked: true } : s))
        );
        setSelectedSlot(null);
        return;
      }
      setConfirmed({
        id: data.appointment.id,
        token_number: data.appointment.token_number,
        patient_name: data.appointment.patient_name,
      });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <section id={id} className="mx-auto max-w-3xl px-5 py-8">
        <TokenSlip
          tokenNumber={confirmed.token_number}
          patientName={confirmed.patient_name}
          date={selectedDate!}
          time={selectedSlot ? selectedSlot.slot_time.slice(0, 5) : ""}
          clinicName={clinics.find((c) => c.id === clinicId)?.name ?? ""}
          onBookAnother={() => {
            setConfirmed(null);
            setSelectedSlot(null);
            setSelectedDate(null);
            setShowForm(false);
          }}
        />
      </section>
    );
  }

  return (
    <section id={id} className="mx-auto max-w-3xl px-5 py-8">
      <h2 className="font-serif text-xl font-semibold text-ink mb-4">Book an Appointment</h2>

      {clinics.length > 1 && (
        <div className="mb-5">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-sage">
            Select Hospital
          </p>
          <div className="space-y-2">
            {clinics.map((c) => (
              <label
                key={c.id}
                className="focus-ring flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-sm has-[:checked]:border-pine has-[:checked]:bg-card"
              >
                <input
                  type="radio"
                  name="clinic"
                  className="accent-pine"
                  checked={clinicId === c.id}
                  onChange={() => {
                    setClinicId(c.id);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                />
                <span className="text-ink">
                  {c.name}
                  {c.city ? `, ${c.city}` : ""}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-line bg-white/40">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <button
            aria-label="Previous month"
            className="focus-ring rounded p-1 text-ink hover:text-pine"
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
            }
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-serif text-sm font-semibold text-ink">
            {formatMonth(viewDate)}
          </span>
          <button
            aria-label="Next month"
            className="focus-ring rounded p-1 text-ink hover:text-pine"
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
            }
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 bg-pine text-paper text-xs font-medium">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-2 text-center">
              {w}
            </div>
          ))}
        </div>

        {!clinicId ? (
          <p className="px-4 py-6 text-center text-sm text-sage">
            Please select a hospital first.
          </p>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-sage">
            <Loader2 size={16} className="animate-spin" /> Loading availability…
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-y-1 p-3">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={idx} />;
              const key = dateKey(day);
              const hasAvailability = (slotsByDate[key] ?? []).some((s) => !s.is_booked);
              const isPast =
                new Date(key) < new Date(new Date().toDateString());
              const isSelected = selectedDate === key;
              return (
                <button
                  key={idx}
                  disabled={isPast}
                  onClick={() => {
                    setSelectedDate(key);
                    setSelectedSlot(null);
                  }}
                  className={`focus-ring mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors
                    ${isPast ? "text-line cursor-not-allowed" : "text-ink hover:bg-card"}
                    ${isSelected ? "bg-ink text-paper hover:bg-ink" : ""}
                    ${!isPast && hasAvailability && !isSelected ? "font-semibold text-pine" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="mt-5">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-sage">
            Available Times — {selectedDate}
          </p>
          {availableSlotsForSelectedDate.length === 0 ? (
            <p className="rounded-lg bg-card px-4 py-3 text-sm text-ink/70">
              No slots available this day. Try another date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSlotsForSelectedDate.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlot(s)}
                  className={`focus-ring rounded-full border px-4 py-2 font-mono text-sm transition-colors
                    ${
                      selectedSlot?.id === s.id
                        ? "border-pine bg-pine text-paper"
                        : "border-line text-ink hover:border-pine"
                    }`}
                >
                  {s.slot_time.slice(0, 5)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-rust/10 px-4 py-3 text-sm text-rust-dark">{error}</p>
      )}

      {selectedSlot && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3.5 font-medium text-paper transition-colors hover:bg-pine-dark"
        >
          Continue to Book
        </button>
      )}

      {showForm && selectedSlot && (
        <PatientForm submitting={submitting} onSubmit={handleConfirm} />
      )}
    </section>
  );
}

function PatientForm({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: (data: { name: string; phone: string; reason: string }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, phone, reason });
      }}
      className="mt-4 space-y-3 rounded-xl border border-line bg-white/60 p-4"
    >
      <div>
        <label htmlFor="patient-name" className="mb-1 block text-xs font-medium text-sage">
          Full name
        </label>
        <input
          id="patient-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus-ring w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink"
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label htmlFor="patient-phone" className="mb-1 block text-xs font-medium text-sage">
          Mobile number
        </label>
        <input
          id="patient-phone"
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="focus-ring w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink"
          placeholder="+91 98XXXXXXXX"
        />
      </div>
      <div>
        <label htmlFor="patient-reason" className="mb-1 block text-xs font-medium text-sage">
          Reason for visit (optional)
        </label>
        <input
          id="patient-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="focus-ring w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink"
          placeholder="e.g. Follow-up consultation"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-pine py-3.5 font-medium text-paper transition-colors hover:bg-pine-dark disabled:opacity-60"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? "Confirming…" : "Confirm Appointment"}
      </button>
    </form>
  );
}

function TokenSlip({
  tokenNumber,
  patientName,
  date,
  time,
  clinicName,
  onBookAnother,
}: {
  tokenNumber: number;
  patientName: string;
  date: string;
  time: string;
  clinicName: string;
  onBookAnother: () => void;
}) {
  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-t-xl bg-ink px-5 py-4 text-center text-paper">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/70">
          Appointment Token
        </p>
        <p className="font-serif text-4xl font-bold tabular-nums">
          {String(tokenNumber).padStart(3, "0")}
        </p>
      </div>
      <div className="tear-divider" />
      <div className="space-y-2 rounded-b-xl border border-t-0 border-line bg-card px-5 py-4 font-mono text-sm text-ink">
        <Row label="Patient" value={patientName} />
        <Row label="Clinic" value={clinicName} />
        <Row label="Date" value={date} />
        <Row label="Time" value={time} />
      </div>
      <p className="mt-4 text-center text-sm text-sage">
        A confirmation has been recorded. Please arrive 10 minutes early with this token
        number.
      </p>
      <button
        onClick={onBookAnother}
        className="focus-ring mt-4 w-full rounded-lg border border-line py-2.5 text-sm font-medium text-ink hover:border-pine hover:text-pine"
      >
        Book another appointment
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-sage">{label}</span>
      <span className="text-right text-ink">{value}</span>
    </div>
  );
}
