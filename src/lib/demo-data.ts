import type { DoctorProfileData } from "@/types/doctor";

export const DEMO_PROFILE: DoctorProfileData = {
  doctor: {
    id: "demo-doctor",
    slug: "demo",
    full_name: "Dr. Anika Rao",
    credentials: "MBBS, MD, DM Cardiology",
    designation: "Senior Consultant — Cardiology",
    specialties: ["Cardiology", "Interventional Cardiology", "Heart Failure"],
    experience_years: 18,
    photo_url: null,
    bio: "Dr. Anika Rao is a senior consultant cardiologist with 18 years of clinical experience in interventional cardiology and heart failure management.",
    phone: "911234567890",
    whatsapp: "911234567890",
    email: "care@example-clinic.com",
  },
  clinics: [
    { id: "demo-clinic-1", name: "Riverside Heart Institute", address: "MG Road", city: "Bengaluru" },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Senior Consultant, Cardiology",
      organization: "Riverside Heart Institute",
      period: "2015 — Present",
      sort_order: 1,
    },
    {
      id: "exp-2",
      role: "Consultant, Cardiology",
      organization: "City General Hospital",
      period: "2010 — 2015",
      sort_order: 2,
    },
    {
      id: "exp-3",
      role: "Senior Resident",
      organization: "National Heart Centre",
      period: "2006 — 2010",
      sort_order: 3,
    },
  ],
  education: [
    {
      id: "edu-1",
      qualification: "DM Cardiology",
      institution: "National Heart Centre",
      year: "2010",
      sort_order: 1,
    },
    {
      id: "edu-2",
      qualification: "MD (General Medicine)",
      institution: "Government Medical College",
      year: "2006",
      sort_order: 2,
    },
    {
      id: "edu-3",
      qualification: "Fellowship, European Society of Cardiology",
      institution: "FESC",
      year: "2014",
      sort_order: 3,
    },
  ],
  posts: [
    {
      id: "post-1",
      slug: "heart-disease-in-women",
      title: "Heart Disease in Women: Early Signs & Changes in Daily Life",
      excerpt: "Subtle body signals you should never ignore.",
      cover_image_url: null,
      tags: ["Cardiology", "Women's Health"],
      published_at: new Date().toISOString(),
    },
    {
      id: "post-2",
      slug: "managing-hypertension",
      title: "Five Daily Habits That Help Manage Hypertension",
      excerpt: "Small, sustainable changes that make a measurable difference.",
      cover_image_url: null,
      tags: ["Hypertension", "Lifestyle"],
      published_at: new Date().toISOString(),
    },
  ],
};
