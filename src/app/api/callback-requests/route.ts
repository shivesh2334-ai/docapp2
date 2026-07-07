import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { doctorId, fullName, phone, whatsappOptIn } = body;

  if (!fullName || !phone) {
    return NextResponse.json(
      { error: "fullName and phone are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("callback_requests").insert({
    doctor_id: doctorId ?? null,
    full_name: fullName,
    phone,
    whatsapp_opt_in: whatsappOptIn ?? true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
