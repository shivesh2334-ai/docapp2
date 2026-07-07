export interface Clinic {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
}

export interface Doctor {
  id: string;
  slug: string;
  full_name: string;
  credentials: string | null;
  designation: string | null;
  specialties: string[];
  experience_years: number | null;
  photo_url: string | null;
  bio: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
}

export interface DoctorExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  sort_order: number;
}

export interface DoctorEducation {
  id: string;
  qualification: string;
  institution: string | null;
  year: string | null;
  sort_order: number;
}

export interface AppointmentSlot {
  id: string;
  doctor_id: string;
  clinic_id: string;
  slot_date: string; // YYYY-MM-DD
  slot_time: string; // HH:MM:SS
  is_booked: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  published_at: string;
}

export interface DoctorProfileData {
  doctor: Doctor;
  clinics: Clinic[];
  experience: DoctorExperience[];
  education: DoctorEducation[];
  posts: BlogPost[];
}
