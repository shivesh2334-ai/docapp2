import { CheckCircle2, MapPin, Clock, Calendar, User, Hash, Phone, Stethoscope } from "lucide-react";
import Link from "next/link";

interface Props {
  appointment: {
    id: string;
    patient_name: string;
    patient_phone: string;
    patient_email?: string | null;
    reason?: string | null;
    token_number?: number | null;
    status: string;
    created_at: string;
  };
  doctor: {
    full_name: string;
    credentials?: string | null;
    designation?: string | null;
    specialties?: string[];
    photo_url?: string | null;
  } | null;
  clinic: {
    name: string;
    address?: string | null;
    city?: string | null;
  } | null;
  slot: {
    slot_date: string;
    slot_time: string;
  } | null;
}

function formatDate(date: string) {
  const [y, m, d] = date.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

function formatDay(date: string) {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
}

function formatTime(time: string) {
  const [hStr, mStr] = time.slice(0, 5).split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}:00 ${period}` : `${hour12}:${mStr} ${period}`;
}

function statusColor(status: string) {
  if (status === "confirmed") return "text-pine bg-pine/10";
  if (status === "cancelled") return "text-rust bg-rust/10";
  return "text-sage bg-sage/10";
}

export function AppointmentConfirmationCard({ appointment, doctor, clinic, slot }: Props) {
  const dept = doctor?.specialties?.[0] ? `${doctor.specialties[0]} OPD` : null;
  const initials = doctor?.full_name
    .split(" ")
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("") ?? "Dr";

  return (
    <div className="min-h-screen bg-paper py-8 px-4">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-pine/10 mb-3">
            <CheckCircle2 size={28} className="text-pine" strokeWidth={1.75} />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Appointment Confirmed</h1>
          <p className="mt-1 text-sm text-sage">Booking ID: {appointment.id.slice(0, 8).toUpperCase()}</p>
        </div>

        {/* Token slip */}
        <div className="overflow-hidden rounded-xl border border-line shadow-sm">

          {/* Token band */}
          <div className="flex items-center justify-between bg-ink px-5 py-4 text-paper">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-paper/60">Token Number</p>
              <p className="font-serif text-4xl font-bold tabular-nums leading-none mt-1">
                {String(appointment.token_number ?? "—").padStart(3, "0")}
              </p>
            </div>
            <div className="text-right">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Tear edge */}
          <div className="tear-divider" />

          {/* Doctor info */}
          {doctor && (
            <div className="flex items-center gap-3 bg-card/60 px-5 py-4 border-b border-line">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pine text-paper font-serif font-semibold">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">{doctor.full_name}</p>
                <p className="text-xs text-sage">{doctor.designation ?? doctor.credentials}</p>
              </div>
            </div>
          )}

          {/* Detail rows */}
          <div className="divide-y divide-line bg-white/40">
            {slot && (
              <>
                <Row icon={<Calendar size={15} className="text-pine" />} label="Date">
                  <span className="font-medium">{formatDate(slot.slot_date)}</span>
                  <span className="ml-2 text-sage text-xs">{formatDay(slot.slot_date)}</span>
                </Row>
                <Row icon={<Clock size={15} className="text-pine" />} label="Time">
                  <span className="font-medium">{formatTime(slot.slot_time)}</span>
                </Row>
              </>
            )}
            {clinic && (
              <Row icon={<MapPin size={15} className="text-pine" />} label="Location">
                <span className="font-medium">{clinic.name}</span>
                {clinic.city && <span className="ml-1 text-sage text-xs">{clinic.city}</span>}
                {clinic.address && <p className="text-xs text-sage mt-0.5">{clinic.address}</p>}
              </Row>
            )}
            {dept && (
              <Row icon={<Stethoscope size={15} className="text-pine" />} label="Department">
                <span className="font-medium">{dept}</span>
              </Row>
            )}
            <Row icon={<User size={15} className="text-pine" />} label="Patient">
              <span className="font-medium">{appointment.patient_name}</span>
            </Row>
            <Row icon={<Phone size={15} className="text-pine" />} label="Mobile">
              <span className="font-medium font-mono">{appointment.patient_phone}</span>
            </Row>
            {appointment.reason && (
              <Row icon={<Hash size={15} className="text-pine" />} label="Reason">
                <span className="text-ink/80">{appointment.reason}</span>
              </Row>
            )}
          </div>

          {/* Footer note */}
          <div className="bg-card/40 px-5 py-4 text-xs text-sage">
            <p>Please arrive <strong className="text-ink">10 minutes early</strong> and carry a valid photo ID.</p>
            <p className="mt-1">Booked on {new Date(appointment.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-3">
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment+with+${encodeURIComponent(doctor?.full_name ?? "Doctor")}&dates=${slot ? slot.slot_date.replace(/-/g, "") + "T" + slot.slot_time.replace(/:/g, "").slice(0,6) + "/" + slot.slot_date.replace(/-/g, "") + "T" + slot.slot_time.replace(/:/g, "").slice(0,6) : ""}&details=${encodeURIComponent(`Token: ${appointment.token_number ?? "—"}\n${clinic?.name ?? ""}`)}&location=${encodeURIComponent(clinic?.name ?? "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-pine text-pine py-3 text-sm font-medium hover:bg-pine hover:text-paper transition-colors"
          >
            <Calendar size={15} />
            Add to Google Calendar
          </a>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-lg border border-line text-ink/70 py-3 text-sm font-medium hover:border-ink hover:text-ink transition-colors"
          >
            Back to clinic
          </Link>
        </div>

        {/* Help line */}
        <p className="mt-6 text-center text-xs text-sage">
          Questions? Contact the clinic directly.
          {appointment.patient_phone && (
            <> Confirmation was sent to <span className="font-mono">{appointment.patient_phone}</span>.</>
          )}
        </p>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-sage mb-0.5">{label}</p>
        <div className="text-sm text-ink">{children}</div>
      </div>
    </div>
  );
}
