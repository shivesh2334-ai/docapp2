# Doctor Profile & Appointment Booking Template

A reusable, production-ready **doctor profile + appointment booking** page for clinics and hospitals — built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase.

Inspired by the structure of large hospital-chain doctor profile pages (header, doctor bio, booking calendar, about/experience timeline, callback lead-capture, video section, blog list, footer), redesigned with an original visual identity: a clinical "letterhead and prescription pad" theme, with appointment confirmations rendered as a tear-off token slip — a nod to how Indian clinics actually hand out queue tokens.

## Features

- **Doctor profile hero** — name, credentials, designation, specialties, years of experience, share button
- **Live appointment booking** — hospital/clinic selector → month calendar → available time slots → patient form → confirmed token slip, all persisted in Supabase with race-condition-safe slot claiming
- **About section** — work experience and education timelines
- **Callback / lead capture form** — phone + name + WhatsApp opt-in, saved to Supabase
- **Doctor Talk** — embeddable video section
- **Blog list** — article cards pulled from Supabase
- **Sticky bottom nav** — Doctors / Book Appt / Chat (WhatsApp) / Call Us / Menu
- **Footer** — quick links, social icons, back-to-top
- Fully responsive, keyboard-accessible (visible focus rings), respects `prefers-reduced-motion`
- Renders with bundled demo data out of the box — no Supabase setup required to preview

## Tech stack

- Next.js 14 (App Router, Server Components)
- TypeScript
- Tailwind CSS
- Supabase (Postgres + Row Level Security) for live data and bookings
- lucide-react for icons

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally (with demo data, no setup needed)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage renders with bundled placeholder data (`src/lib/demo-data.ts`) until you connect Supabase.

### 3. Connect Supabase (for real bookings)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run the contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates all tables, Row Level Security policies, and seeds one example doctor.
3. Copy `.env.example` to `.env.local` and fill in your project's URL and anon key (found under **Project Settings → API**):

   ```bash
   cp .env.example .env.local
   ```

4. Restart the dev server. The homepage will now load the doctor matching `NEXT_PUBLIC_DEFAULT_DOCTOR_SLUG` (defaults to the seeded `dr-shivesh-kumar` row — change the slug or edit the seed data to use your own).

### 4. Add appointment slots

Slots are rows in `appointment_slots`. Insert availability for a doctor/clinic, e.g.:

```sql
insert into appointment_slots (doctor_id, clinic_id, slot_date, slot_time)
values
  ('<doctor-id>', '<clinic-id>', '2026-06-25', '10:00'),
  ('<doctor-id>', '<clinic-id>', '2026-06-25', '10:30'),
  ('<doctor-id>', '<clinic-id>', '2026-06-25', '11:00');
```

In a real deployment you'd generate these on a schedule (e.g. a daily cron job or Supabase Edge Function) based on the doctor's working hours.

## Customizing for your own doctor/clinic

- Edit or insert rows in `doctors`, `clinics`, `doctor_clinics`, `doctor_experience`, `doctor_education`, and `blog_posts`.
- Set `NEXT_PUBLIC_DEFAULT_DOCTOR_SLUG` to the `slug` of the doctor you want shown on `/`.
- To support multiple doctors on different URLs, duplicate `src/app/page.tsx` into a dynamic route like `src/app/doctor/[slug]/page.tsx` and pass the `slug` param into `getDoctorProfile`.
- Colors, type, and the token-slip motif live in `tailwind.config.ts` and `src/app/globals.css` — adjust the palette there to match your brand.

## Deploying to Vercel

1. Push this repository to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add the environment variables from `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_DEFAULT_DOCTOR_SLUG`) in the Vercel project settings.
4. Deploy. Vercel will build and host the app automatically on every push to `main`.

## Project structure

```
src/
  app/
    page.tsx                 # Homepage — assembles all sections
    layout.tsx                # Fonts, metadata
    globals.css                # Design tokens, reduced-motion, divider utility
    api/
      slots/route.ts           # GET available slots for a doctor+clinic+month
      appointments/route.ts    # POST to book a slot (atomic claim + token number)
      callback-requests/route.ts # POST lead-capture form
  components/                 # All UI sections (Hero, BookingWidget, AboutDoctor, etc.)
  lib/
    supabase/                  # Browser + server Supabase clients
    get-doctor-profile.ts      # Data-fetching with demo-data fallback
    demo-data.ts                # Placeholder content shown before Supabase is wired up
  types/doctor.ts              # Shared TypeScript types matching the schema
supabase/schema.sql           # Full DB schema, RLS policies, and seed data
```

## License

This template is provided as-is for you to adapt for your own clinic, hospital, or practice.

---

## SMS appointment confirmations (Twilio)

When a patient books a slot, an SMS is automatically dispatched to their registered mobile number in this format:

> Dear Mr. Vijay, your appointment with Dr. Chandrashekar is confirmed at 2:00 PM on 10/07/2026 at Yatharth Hospital, Cardiology OPD.
>
> See your appointment details here:
> https://your-app.vercel.app/appointment/abc12345
>
> Please arrive 10 minutes early. Reply CANCEL to cancel.

The link opens a public appointment confirmation page with full details, a tear-off token number, and a "Add to Google Calendar" button.

### Setup

1. **Create a free Twilio account** at [twilio.com](https://twilio.com). The free trial includes ~$15 credit — enough for hundreds of SMS.
2. From the Twilio Console, note your **Account SID**, **Auth Token**, and **From number** (or buy one).
3. Add these to `.env.local` (and to your Vercel project's environment variables):
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_FROM_NUMBER=+1XXXXXXXXXX
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
4. SMS is **fire-and-forget** — a Twilio failure never blocks or breaks the booking response. Errors are logged to the Vercel function log.

### Important: India DLT registration (for Indian +91 numbers)

TRAI requires all commercial SMS senders to register their **Entity** and **Templates** on the DLT (Distributed Ledger Technology) portal before they can deliver messages to Indian mobile numbers. Without DLT registration, SMS to +91 numbers will be blocked by carriers.

Steps:
1. Register as an entity on your telecom operator's DLT portal (Vodafone-Idea, Jio, Airtel, BSNL, etc.) or use Twilio's India DLT registration service.
2. Register the message template. The template ID gets linked to your Twilio sender.
3. Use a **registered sender ID** (e.g. `DOCPRF`) as `TWILIO_FROM_NUMBER` instead of a +1 long-code.
4. See [Twilio's India DLT guide](https://help.twilio.com/articles/india-sms-regulations) for the exact process.

During development, Twilio trial accounts can send to verified numbers without DLT registration.
