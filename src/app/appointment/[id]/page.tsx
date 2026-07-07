import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppointmentConfirmationCard } from "@/components/AppointmentConfirmationCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Appointment Confirmation — ${id.slice(0, 8).toUpperCase()}`,
    description: "Your appointment details and confirmation.",
  };
}

export default async function AppointmentPage({ params }: PageProps) {
  const { id } = await params;

  // Graceful fallback when Supabase is not yet configured (demo mode).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <AppointmentConfirmationCard
        appointment={DEMO_APPOINTMENT}
        doctor={DEMO_DOCTOR}
        clinic={DEMO_CLINIC}
        slot={DEMO_SLOT}
      />
    );
  }

  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (!appointment) notFound();

  const [{ data: doctor }, { data: clinic }, { data: slot }] = await Promise.all([
    supabase.from("doctors").select("*").eq("id", appointment.doctor_id).single(),
    supabase.from("clinics").select("*").eq("id", appointment.clinic_id).single(),
    appointment.slot_id
      ? supabase
          .from("appointment_slots")
          .select("slot_date, slot_time")
          .eq("id", appointment.slot_id)
          .single()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <AppointmentConfirmationCard
      appointment={appointment}
      doctor={doctor}
      clinic={clinic}
      slot={slot}
    />
  );
}

// ---- Demo data for preview without Supabase ----
const DEMO_APPOINTMENT = {
  id: "demo-appt-001",
  patient_name: "Mr. Vijay Kumar",
  patient_phone: "+91 98000 00001",
  patient_email: null,
  reason: "Cardiac follow-up",
  token_number: 7,
  status: "confirmed",
  created_at: new Date().toISOString(),
};

const DEMO_DOCTOR = {
  id: "demo-doctor",
  full_name: "Dr. Anika Rao",
  credentials: "MBBS, MD, DM Cardiology",
  designation: "Senior Consultant — Cardiology",
  specialties: ["Cardiology", "Interventional Cardiology"],
  photo_url: null,
};

const DEMO_CLINIC = {
  id: "demo-clinic",
  name: "Riverside Heart Institute",
  address: "MG Road",
  city: "Bengaluru",
};

const DEMO_SLOT = {
  slot_date: "2026-07-10",
  slot_time: "14:00:00",
};
