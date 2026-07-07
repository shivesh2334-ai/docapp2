"use client";

import { Stethoscope, CalendarCheck, MessageCircle, Phone, Menu } from "lucide-react";

interface BottomNavProps {
  whatsapp?: string | null;
  phone?: string | null;
  onBookClick?: () => void;
}

export function BottomNav({ whatsapp, phone, onBookClick }: BottomNavProps) {
  const items = [
    { icon: Stethoscope, label: "Doctors", href: "#about" },
    { icon: CalendarCheck, label: "Book Appt", onClick: onBookClick },
    {
      icon: MessageCircle,
      label: "Chat",
      href: whatsapp ? `https://wa.me/${whatsapp}` : undefined,
    },
    { icon: Phone, label: "Call Us", href: phone ? `tel:${phone}` : "tel:108" },
    { icon: Menu, label: "Menu", href: "#" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-paper"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-between px-2">
        {items.map(({ icon: Icon, label, href, onClick }) => {
          const content = (
            <span className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink/80 hover:text-pine transition-colors">
              <Icon size={20} strokeWidth={1.75} />
              {label}
            </span>
          );
          return href ? (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="focus-ring flex-1 text-center"
            >
              {content}
            </a>
          ) : (
            <button
              key={label}
              onClick={onClick}
              className="focus-ring flex-1 text-center"
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
