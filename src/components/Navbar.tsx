import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/editor", label: "Editor" },
  { to: "/tutorial", label: "Tutorial" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-serif font-bold text-sm">P</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">PMNT</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname === l.to ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link to="/editor">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
              Start Writing
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium py-2 ${
                  location.pathname === l.to ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <Link to="/editor" onClick={() => setOpen(false)} className="flex-1">
                <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
