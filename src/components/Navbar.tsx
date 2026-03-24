import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/editor", label: "Editor" },
  { to: "/tutorial", label: "Tutorial" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav
        className={`w-full max-w-3xl transition-all duration-500 rounded-[2rem] border ${
          scrolled
            ? "bg-background/80 backdrop-blur-2xl border-border shadow-[0_8px_32px_-8px] shadow-foreground/[0.08]"
            : "bg-background/95 backdrop-blur-xl border-transparent shadow-none"
        }`}
      >
        <div className="px-5 h-14 flex items-center justify-between">
          <Link to="/" className="group">
            <span className="font-serif text-lg font-semibold tracking-tight">PMNT</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  location.pathname === l.to
                    ? "text-foreground bg-foreground/[0.06]"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link to="/editor">
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl px-5 h-9 text-[13px]">
                Start Writing
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/30 px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "text-foreground bg-foreground/[0.06]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 mt-1 border-t border-border/30">
              <ThemeToggle />
              <Link to="/editor" onClick={() => setOpen(false)} className="flex-1">
                <Button size="sm" className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
