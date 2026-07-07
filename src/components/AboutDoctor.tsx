import { Briefcase, GraduationCap } from "lucide-react";
import type { DoctorEducation, DoctorExperience } from "@/types/doctor";

export function AboutDoctor({
  name,
  experience,
  education,
}: {
  name: string;
  experience: DoctorExperience[];
  education: DoctorEducation[];
}) {
  return (
    <section id="about" className="mx-auto max-w-3xl px-5 py-8">
      <h2 className="font-serif text-xl font-semibold text-ink">About {name}</h2>

      <TimelineGroup
        icon={<Briefcase size={16} strokeWidth={1.75} />}
        title="Work Experience"
        items={experience.map((e) => ({
          id: e.id,
          primary: e.role,
          secondary: e.organization,
          tag: e.period,
        }))}
      />

      <TimelineGroup
        icon={<GraduationCap size={16} strokeWidth={1.75} />}
        title="Education & Training"
        items={education.map((e) => ({
          id: e.id,
          primary: e.qualification,
          secondary: e.institution ?? "",
          tag: e.year ?? "",
        }))}
      />
    </section>
  );
}

function TimelineGroup({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: { id: string; primary: string; secondary: string; tag: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-2 text-pine">
        {icon}
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <ol className="space-y-4 border-l border-line pl-5">
        {items.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-pine" />
            <p className="text-sm text-ink">{item.primary}</p>
            {item.secondary && <p className="text-sm text-ink/70">{item.secondary}</p>}
            {item.tag && (
              <p className="font-mono text-xs text-sage">{item.tag}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
