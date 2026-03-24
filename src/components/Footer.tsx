import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background relative overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="font-serif text-2xl font-semibold tracking-tight">PMNT</span>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Your thoughts, beautifully organized. A premium markdown note-taking experience.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-semibold mb-5 text-muted-foreground tracking-widest uppercase">Product</h4>
            <div className="flex flex-col gap-3">
              <Link to="/editor" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Editor</Link>
              <Link to="/tutorial" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Tutorial</Link>
              <span className="text-sm text-foreground/70">Changelog</span>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-semibold mb-5 text-muted-foreground tracking-widest uppercase">Company</h4>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">About</Link>
              <span className="text-sm text-foreground/70">Blog</span>
              <span className="text-sm text-foreground/70">Careers</span>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-semibold mb-5 text-muted-foreground tracking-widest uppercase">Legal</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-foreground/70">Privacy</span>
              <span className="text-sm text-foreground/70">Terms</span>
              <span className="text-sm text-foreground/70">License</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PMNT. Crafted with precision.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Twitter</span>
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">GitHub</span>
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
