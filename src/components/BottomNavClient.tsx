"use client";

import { BottomNav } from "@/components/BottomNav";

export function BottomNavClient({
  whatsapp,
  phone,
}: {
  whatsapp?: string | null;
  phone?: string | null;
}) {
  return (
    <BottomNav
      whatsapp={whatsapp}
      phone={phone}
      onBookClick={() =>
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
      }
    />
  );
}
