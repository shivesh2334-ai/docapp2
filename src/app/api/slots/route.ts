import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const clinicId = searchParams.get("clinicId");
  const month = searchParams.get("month"); // YYYY-MM

  if (!doctorId || !clinicId || !month) {
    return NextResponse.json(
      { error: "doctorId, clinicId and month are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const start = `${month}-01`;
  const [year, mon] = month.split("-").map(Number);
  const endDate = new Date(year, mon, 0).getDate();
  const end = `${month}-${String(endDate).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("appointment_slots")
    .select("id, slot_date, slot_time, is_booked")
    .eq("doctor_id", doctorId)
    .eq("clinic_id", clinicId)
    .gte("slot_date", start)
    .lte("slot_date", end)
    .order("slot_date", { ascending: true })
    .order("slot_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slots: data ?? [] });
}
