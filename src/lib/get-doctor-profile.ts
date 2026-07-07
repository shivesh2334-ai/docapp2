import { createClient } from "@/lib/supabase/server";
import type { DoctorProfileData } from "@/types/doctor";
import { DEMO_PROFILE } from "@/lib/demo-data";

/**
 * Fetches a full doctor profile (doctor + clinics + experience + education + posts)
 * by slug. Falls back to demo data if Supabase env vars aren't configured yet or
 * the row doesn't exist, so the template is always viewable out of the box.
 */
export async function getDoctorProfile(slug: string): Promise<DoctorProfileData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return DEMO_PROFILE;
  }

  try {
    const supabase = await createClient();

    const { data: doctor, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !doctor) return DEMO_PROFILE;

    const [{ data: doctorClinics }, { data: experience }, { data: education }, { data: posts }] =
      await Promise.all([
        supabase
          .from("doctor_clinics")
          .select("clinics(*)")
          .eq("doctor_id", doctor.id),
        supabase
          .from("doctor_experience")
          .select("*")
          .eq("doctor_id", doctor.id)
          .order("sort_order"),
        supabase
          .from("doctor_education")
          .select("*")
          .eq("doctor_id", doctor.id)
          .order("sort_order"),
        supabase
          .from("blog_posts")
          .select("*")
          .eq("doctor_id", doctor.id)
          .order("published_at", { ascending: false })
          .limit(5),
      ]);

    const clinics =
      (doctorClinics ?? [])
        .map((dc: { clinics: unknown }) => dc.clinics)
        .filter(Boolean) as DoctorProfileData["clinics"];

    return {
      doctor,
      clinics: clinics.length > 0 ? clinics : DEMO_PROFILE.clinics,
      experience: experience ?? [],
      education: education ?? [],
      posts: posts ?? [],
    };
  } catch {
    return DEMO_PROFILE;
  }
}
