import twilio from "twilio";

interface AppointmentSmsParams {
  patientName: string;
  doctorName: string;
  clinicName: string;
  department?: string | null;
  slotDate: string;    // YYYY-MM-DD
  slotTime: string;    // HH:MM
  appointmentId: string;
  patientPhone: string;
}

/**
 * Formats a patient-facing phone number to E.164.
 * Handles Indian numbers: 10-digit local → +91XXXXXXXXXX
 * Numbers already starting with + are passed through.
 */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return `+${digits}`;
  // 10-digit Indian mobile number
  if (digits.length === 10) return `+91${digits}`;
  // 12-digit with 91 country code
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

/**
 * Formats YYYY-MM-DD as DD/MM/YYYY
 */
function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Formats HH:MM (24h) as 12h with AM/PM
 */
function formatTime(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${mStr} ${period}`;
}

export async function sendAppointmentSms(params: AppointmentSmsParams): Promise<void> {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER,
    NEXT_PUBLIC_APP_URL,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.warn("[SMS] Twilio env vars not set — skipping SMS dispatch.");
    return;
  }

  const appUrl = NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const confirmationLink = appUrl
    ? `${appUrl}/appointment/${params.appointmentId}`
    : null;

  const dept = params.department ? `, ${params.department}` : "";
  const lines = [
    `Dear ${params.patientName}, your appointment with ${params.doctorName} is confirmed at ${formatTime(params.slotTime)} on ${formatDate(params.slotDate)} at ${params.clinicName}${dept}.`,
  ];

  if (confirmationLink) {
    lines.push(`\nSee your appointment details here:\n${confirmationLink}`);
  }

  lines.push("\nPlease arrive 10 minutes early. Reply CANCEL to cancel.");

  const body = lines.join("");

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  await client.messages.create({
    from: TWILIO_FROM_NUMBER,
    to: toE164(params.patientPhone),
    body,
  });

  console.log(`[SMS] Sent to ${params.patientPhone} for appointment ${params.appointmentId}`);
}
