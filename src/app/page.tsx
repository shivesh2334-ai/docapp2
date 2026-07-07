import { getDoctorProfile } from "@/lib/get-doctor-profile";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DoctorHero } from "@/components/DoctorHero";
import { BookingWidget } from "@/components/BookingWidget";
import { AboutDoctor } from "@/components/AboutDoctor";
import { CallbackCard } from "@/components/CallbackCard";
import { DoctorTalk } from "@/components/DoctorTalk";
import { BlogSection } from "@/components/BlogSection";
import { BottomNavClient } from "@/components/BottomNavClient";

// Change this to your doctor's slug once you've added them in Supabase.
const DOCTOR_SLUG = process.env.NEXT_PUBLIC_DEFAULT_DOCTOR_SLUG ?? "demo";

export default async function Home() {
  const { doctor, clinics, experience, education, posts } = await getDoctorProfile(
    DOCTOR_SLUG
  );

  return (
    <div className="pb-20">
      <SiteHeader clinicName={clinics[0]?.name ?? "Clinic"} />

      <main>
        <DoctorHero doctor={doctor} />
        <div className="tear-divider mx-auto max-w-3xl" />

        <BookingWidget doctorId={doctor.id} clinics={clinics} id="booking" />
        <div className="tear-divider mx-auto max-w-3xl" />

        <AboutDoctor name={doctor.full_name} experience={experience} education={education} />
        <div className="tear-divider mx-auto max-w-3xl" />

        <CallbackCard doctorId={doctor.id} email={doctor.email} />

        <DoctorTalk videoUrl={null} title="Doctor Talk" />

        <BlogSection posts={posts} />
      </main>

      <SiteFooter clinicName={clinics[0]?.name ?? "Clinic"} />

      <BottomNavClient whatsapp={doctor.whatsapp} phone={doctor.phone} />
    </div>
  );
}
