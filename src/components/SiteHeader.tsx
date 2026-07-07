import { Search, Siren } from "lucide-react";

export function SiteHeader({ clinicName }: { clinicName: string }) {
  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <span className="font-serif text-lg font-semibold tracking-tight text-ink">
          {clinicName}
        </span>
        <nav className="flex items-center gap-5 text-sm text-sage">
          <button
            aria-label="Search"
            className="focus-ring flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <Search size={17} strokeWidth={2} />
            <span className="hidden sm:inline">Search</span>
          </button>
          <a
            href="tel:108"
            aria-label="Emergency"
            className="focus-ring flex items-center gap-1.5 text-rust hover:text-rust-dark transition-colors"
          >
            <Siren size={17} strokeWidth={2} />
            <span className="hidden sm:inline">Emergency</span>
          </a>
        </nav>
      </div>
      {/* letterhead rule */}
      <div className="h-px bg-ink/90" />
      <div className="tear-divider" />
    </header>
  );
}
