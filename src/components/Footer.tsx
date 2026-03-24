import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-serif font-bold text-sm">P</span>
              </div>
              <span className="font-serif text-xl font-semibold">PMNT</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your thoughts, beautifully organized. A premium markdown note-taking experience.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold mb-4 text-foreground">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/editor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Editor</Link>
              <Link to="/tutorial" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tutorial</Link>
              <span className="text-sm text-muted-foreground">Changelog</span>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold mb-4 text-foreground">Company</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <span className="text-sm text-muted-foreground">Blog</span>
              <span className="text-sm text-muted-foreground">Careers</span>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold mb-4 text-foreground">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-muted-foreground">Privacy</span>
              <span className="text-sm text-muted-foreground">Terms</span>
              <span className="text-sm text-muted-foreground">License</span>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
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
