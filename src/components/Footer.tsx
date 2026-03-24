import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border/30 overflow-hidden">
      {/* Subtle top line accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Upper grid */}
        <div className="pt-16 pb-12 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-lg font-semibold tracking-tight">PMNT</span>
            <p className="text-[13px] text-muted-foreground leading-relaxed mt-3 max-w-[240px]">
              Free & open-source markdown note taker. Your thoughts, your device, your privacy.
            </p>
          </div>

          {/* Col 2: Navigate */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground/60 tracking-[0.2em] uppercase mb-4">Navigate</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/editor", label: "Editor" },
                { to: "/tutorial", label: "Tutorial" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[13px] text-foreground/60 hover:text-foreground transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Resources */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground/60 tracking-[0.2em] uppercase mb-4">Resources</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { to: "/about", label: "About" },
                { to: "/tutorial", label: "Markdown Guide" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[13px] text-foreground/60 hover:text-foreground transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="#"
                className="text-[13px] text-foreground/60 hover:text-foreground transition-colors w-fit inline-flex items-center gap-1"
              >
                GitHub <ArrowUpRight className="w-3 h-3" />
              </a>
            </nav>
          </div>

          {/* Col 4: Connect */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground/60 tracking-[0.2em] uppercase mb-4">Connect</p>
            <nav className="flex flex-col gap-2.5">
              {["Twitter", "Discord"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-[13px] text-foreground/60 hover:text-foreground transition-colors w-fit inline-flex items-center gap-1"
                >
                  {label} <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/30" />

        {/* Giant wordmark */}
        <div className="py-8 md:py-10 flex flex-col md:flex-row items-end justify-between gap-4">
          <h2
            className="font-serif text-[clamp(4rem,12vw,10rem)] font-bold leading-[0.85] tracking-[-0.04em] text-foreground/[0.06] select-none"
            aria-hidden="true"
          >
            PMNT
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 pb-2 md:pb-4">
            <p className="text-[11px] text-muted-foreground/50">
              © {currentYear} PMNT
            </p>
            <span className="hidden md:block text-muted-foreground/20">·</span>
            <p className="text-[11px] text-muted-foreground/50">
              MIT License · Free forever
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
