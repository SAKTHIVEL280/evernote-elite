import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Pen } from "lucide-react";

const currentYear = new Date().getFullYear();

const navLinks = [
  { to: "/editor", label: "Editor" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tutorial", label: "Tutorial" },
  { to: "/about", label: "About" },
];

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Discord", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      {/* Decorative ink bleed line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="absolute top-0 left-[20%] w-32 h-[1px] bg-accent/40 blur-sm" />
      <div className="absolute top-0 right-[30%] w-20 h-[1px] bg-accent/30 blur-sm" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Top section: large branding */}
        <div className="pt-20 pb-16 md:pt-28 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between flex-col md:flex-row gap-10">
              {/* Large wordmark */}
              <div className="max-w-md">
                <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-5">
                  Write with
                  <br />
                  <span className="italic text-accent">intention.</span>
                </h2>
                <p className="text-background/50 text-sm leading-relaxed">
                  PMNT is a free, open-source markdown note taker designed for people who
                  think in text. No accounts. No cloud. Just your thoughts, beautifully organized.
                </p>
              </div>

              {/* CTA */}
              <Link
                to="/editor"
                className="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-background/10 hover:border-accent/40 bg-background/[0.04] hover:bg-background/[0.08] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Pen className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-medium block">Start Writing</span>
                  <span className="text-[11px] text-background/40">No sign-up required</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-background/30 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-background/[0.08]" />

        {/* Bottom section: nav + legal */}
        <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[13px] text-background/40 hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <span className="hidden md:block w-px h-3 bg-background/10" />
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-background/40 hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-semibold tracking-tight text-background/60">PMNT</span>
            <span className="text-background/20">·</span>
            <p className="text-[11px] text-background/30">
              © {currentYear} · Free & open source · MIT License
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
