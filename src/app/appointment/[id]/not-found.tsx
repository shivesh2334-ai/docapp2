import Link from "next/link";

export default function AppointmentNotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="font-mono text-5xl font-bold text-line">404</p>
        <h1 className="font-serif text-xl font-semibold text-ink mt-3">
          Appointment not found
        </h1>
        <p className="text-sm text-sage mt-2">
          This link may have expired or the appointment ID is invalid. Please contact the clinic directly.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-pine text-pine px-6 py-2.5 text-sm font-medium hover:bg-pine hover:text-paper transition-colors"
        >
          Go to clinic home
        </Link>
      </div>
    </div>
  );
}
