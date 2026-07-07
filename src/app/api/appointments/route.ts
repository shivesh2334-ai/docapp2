import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendAppointmentSms } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slotId, doctorId, clinicId, patientName, patientPhone, patientEmail, reason } = body;

  if (!slotId || !doctorId || !clinicId || !patientName || !patientPhone) {
    return NextResponse.json(
      { error: "slotId, doctorId, clinicId, patientName and patientPhone are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Atomically claim the slot: only succeeds if it's still unbooked.
  const { data: claimed, error: claimError } = await supabase
    .from("appointment_slots")
    .update({ is_booked: true })
    .eq("id", slotId)
    .eq("is_booked", false)
    .select("id, slot_date, slot_time")
    .single();

  if (claimError || !claimed) {
    return NextResponse.json(
      { error: "This slot was just booked by someone else. Please choose another." },
      { status: 409 }
    );
  }

  // Fetch doctor + clinic names for the SMS message.
  const [{ data: doctor }, { data: clinic }] = await Promise.all([
    supabase.from("doctors").select("full_name, designation, specialties").eq("id", doctorId).single(),
    supabase.from("clinics").select("name, city").eq("id", clinicId).single(),
  ]);

  // Determine a simple sequential token number for this doctor at this clinic.
  const { count } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("clinic_id", clinicId)
    .eq("doctor_id", doctorId);

  const tokenNumber = (count ?? 0) + 1;

  const { data: appointment, error: insertError } = await supabase
    .from("appointments")
    .insert({
      slot_id: slotId,
      doctor_id: doctorId,
      clinic_id: clinicId,
      patient_name: patientName,
      patient_phone: patientPhone,
      patient_email: patientEmail ?? null,
      reason: reason ?? null,
      token_number: tokenNumber,
    })
    .select()
    .single();

  if (insertError) {
    // Roll back the slot claim so it isn't stuck as booked with no appointment.
    await supabase.from("appointment_slots").update({ is_booked: false }).eq("id", slotId);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Dispatch SMS — fire-and-forget. A failure here must NOT block the booking response.
  const department =
    doctor && doctor.specialties?.length > 0 ? `${doctor.specialties[0]} OPD` : null;

  sendAppointmentSms({
    patientName,
    doctorName: doctor?.full_name ?? "your doctor",
    clinicName: clinic ? `${clinic.name}${clinic.city ? ", " + clinic.city : ""}` : "the clinic",
    department,
    slotDate: claimed.slot_date,
    slotTime: claimed.slot_time.slice(0, 5),
    appointmentId: appointment.id,
    patientPhone,
  }).catch((err) => {
    // Log but never throw — SMS failure is non-fatal.
    console.error("[SMS] Failed to send appointment confirmation:", err?.message ?? err);
  });

  return NextResponse.json({ appointment });
}
