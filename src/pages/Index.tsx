import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Split,
  Keyboard,
  Download,
  FolderOpen,
  Zap,
  Check,
  ArrowRight,
  Star,
  Pen,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: Split,
    title: "Live Split Preview",
    description: "Write markdown on the left, see it rendered beautifully on the right. Resize panes to your preference.",
  },
  {
    icon: Keyboard,
    title: "Keyboard-First Design",
    description: "Ctrl+B for bold, Ctrl+I for italic, and dozens more shortcuts. Your fingers never leave the keyboard.",
  },
  {
    icon: FolderOpen,
    title: "Organized Notes",
    description: "Create, search, and manage unlimited notes. Everything auto-saves locally — no account needed.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download any note as a clean .md file. Your data is always yours to keep and move.",
  },
  {
    icon: Zap,
    title: "Zen Mode",
    description: "Distraction-free fullscreen writing. Just you, your thoughts, and a beautiful canvas.",
  },
  {
    icon: Pen,
    title: "Rich Formatting",
    description: "Tables, code blocks, task lists, blockquotes — full GFM support with instant rendering.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Technical Writer",
    quote: "PMNT replaced three different apps for me. The split preview alone is worth it.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Software Engineer",
    quote: "Finally, a markdown editor that feels premium without the bloat. Keyboard shortcuts are chef's kiss.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Content Strategist",
    quote: "I use PMNT daily for all my content drafts. The zen mode is incredibly productive.",
    rating: 5,
  },
];


const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[15%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-52 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.06] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-accent tracking-wide">Personal Markdown Note Taker</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.03] tracking-[-0.02em] mb-8"
          >
            Your thoughts,
            <br />
            <span className="italic text-accent">beautifully</span> organized.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed"
          >
            A premium markdown editor crafted for focus. Write, preview, and organize
            your notes with an interface that stays out of your way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/editor">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-8 h-12 text-sm font-medium rounded-xl shadow-lg shadow-foreground/10">
                Open Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tutorial">
              <Button size="lg" variant="outline" className="px-8 h-12 text-sm font-medium rounded-xl border-border/60">
                Learn Markdown
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Editor Preview — elevated with layered shadows */}
      <section className="px-6 pb-28 md:pb-40 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Glow behind the card */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-accent/[0.06] blur-3xl scale-[1.02]" />
            
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-[0_20px_70px_-15px] shadow-foreground/[0.08]">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-[11px] text-muted-foreground font-mono px-3 py-0.5 rounded-md bg-foreground/[0.04]">meeting-notes.md</span>
                </div>
                <div className="w-[54px]" />
              </div>
              <div className="grid grid-cols-2 divide-x divide-border/50">
                <div className="p-7 font-mono text-[13px] text-muted-foreground leading-[1.8]">
                  <p className="text-foreground/80"># Meeting Notes</p>
                  <p className="mt-3">## Key Decisions</p>
                  <p className="mt-2">- Launch date set for **March 15th**</p>
                  <p>- Budget approved for Q2 campaign</p>
                  <p>- New hire starts *next Monday*</p>
                  <p className="mt-3">## Action Items</p>
                  <p className="mt-2">1. Finalize design mockups</p>
                  <p>2. Review analytics dashboard</p>
                  <p>3. Schedule team retrospective</p>
                  <p className="mt-3">{"> Great meeting, team! 🎉"}</p>
                </div>
                <div className="p-7 text-[13px] leading-[1.8]">
                  <h1 className="font-serif text-2xl font-bold mb-4 text-foreground">Meeting Notes</h1>
                  <h2 className="font-serif text-base font-bold mb-2 text-foreground/90">Key Decisions</h2>
                  <ul className="list-disc pl-5 mb-4 space-y-1 text-foreground/80">
                    <li>Launch date set for <strong className="text-foreground">March 15th</strong></li>
                    <li>Budget approved for Q2 campaign</li>
                    <li>New hire starts <em>next Monday</em></li>
                  </ul>
                  <h2 className="font-serif text-base font-bold mb-2 text-foreground/90">Action Items</h2>
                  <ol className="list-decimal pl-5 mb-4 space-y-1 text-foreground/80">
                    <li>Finalize design mockups</li>
                    <li>Review analytics dashboard</li>
                    <li>Schedule team retrospective</li>
                  </ol>
                  <blockquote className="border-l-[3px] border-accent pl-4 italic text-muted-foreground">
                    Great meeting, team! 🎉
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-28 md:py-40 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
              Features
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-semibold mb-6 tracking-[-0.01em]">
              Everything you need,
              <br className="hidden md:block" />
              <span className="italic"> nothing you don't</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
              Built for writers who demand precision and elegance in their tools.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group p-7 rounded-2xl border border-border/40 bg-background/80 backdrop-blur-sm hover:border-accent/25 hover:shadow-lg hover:shadow-accent/[0.04] transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-all duration-500">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2.5 tracking-[-0.01em]">{feature.title}</h3>
                <p className="text-muted-foreground text-[13px] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider accent line */}
      <div className="flex justify-center py-4">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      {/* Testimonials */}
      <section className="px-6 py-28 md:py-40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
              Testimonials
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-5xl font-semibold tracking-[-0.01em]">
              Loved by writers
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="p-7 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-all duration-500"
              >
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-[1.7] mb-6 text-foreground/85 font-light italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-accent">{t.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-28 md:py-40 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
              Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-5xl font-semibold mb-5 tracking-[-0.01em]">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-base">
              Start free. Upgrade when you're ready.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`p-8 rounded-2xl border relative transition-all duration-500 ${
                  tier.highlighted
                    ? "border-accent/40 bg-background shadow-[0_20px_60px_-15px] shadow-accent/[0.1]"
                    : "border-border/40 bg-background/80 hover:border-border/60"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-foreground text-background text-[10px] font-semibold rounded-full tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="font-serif text-2xl font-semibold mb-1.5">{tier.name}</h3>
                <p className="text-[13px] text-muted-foreground mb-5">{tier.description}</p>
                <div className="mb-7">
                  <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{tier.period}</span>
                </div>
                <Button
                  className={`w-full mb-7 rounded-xl h-10 text-[13px] font-medium ${
                    tier.highlighted
                      ? "bg-foreground text-background hover:bg-foreground/90 shadow-md shadow-foreground/10"
                      : "border-border/60"
                  }`}
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-foreground/80">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 md:py-40 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <motion.h2 variants={fadeUp} custom={0} className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-[-0.02em]">
            Ready to write?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-base mb-10 max-w-md mx-auto leading-relaxed">
            No sign-up required. Open the editor and start writing immediately.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link to="/editor">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-10 h-12 text-sm font-medium rounded-xl shadow-lg shadow-foreground/10">
                Open Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
