import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { usePageSEO } from "@/hooks/use-page-seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedEditorPreview } from "@/components/AnimatedEditorPreview";
import { Button } from "@/components/ui/button";
import {
  Split, Keyboard, Download, FolderOpen, Zap, Check,
  ArrowRight, Pen, Shield, Tag, Pin, Archive,
  Command, FileText, Sparkles,
} from "lucide-react";
import heroImg from "@/assets/hero-workspace.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const featureCards = [
  {
    icon: Split,
    title: "Live split preview",
    description: "Write markdown on the left, see it rendered beautifully on the right in real time.",
    accent: "from-accent/10 to-accent/5",
    border: "border-accent/20",
  },
  {
    icon: Command,
    title: "Command palette",
    description: "Ctrl+K to search notes, switch folders, and trigger any action instantly.",
    accent: "from-primary/10 to-primary/5",
    border: "border-primary/20",
  },
  {
    icon: Shield,
    title: "100% private",
    description: "No accounts, no cloud, no tracking. Everything lives in your browser.",
    accent: "from-accent/8 to-primary/5",
    border: "border-accent/15",
  },
];

const allFeatures = [
  { icon: Keyboard, title: "Keyboard-first", desc: "Ctrl+B, Ctrl+I, and dozens more shortcuts." },
  { icon: FolderOpen, title: "Folders & organization", desc: "Drag-and-drop into nested folders." },
  { icon: Tag, title: "Tags & filters", desc: "Color-coded tags with instant filtering." },
  { icon: Pin, title: "Pin & favorites", desc: "Pin notes to the top of your sidebar." },
  { icon: Archive, title: "Trash & restore", desc: "Soft-delete with recoverable trash bin." },
  { icon: FileText, title: "Templates", desc: "Meeting notes, journal, project plans." },
  { icon: Download, title: "Export anywhere", desc: "Download as .md, .html, or print to PDF." },
  { icon: Zap, title: "Zen mode", desc: "Distraction-free fullscreen writing." },
  { icon: Pen, title: "Rich formatting", desc: "Tables, code blocks, task lists, and full GFM support." },
];

const Index = () => {
  usePageSEO({ title: "Free Markdown Note Taker", description: "PMNT is a free, open-source markdown note-taking app. Write, organize, and export notes privately in your browser.", path: "/" });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative h-screen px-2 md:px-3 pt-2 md:pt-3 pb-2 md:pb-3 overflow-hidden flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex-1 w-full"
        >
          <div className="relative rounded-xl overflow-hidden h-full">
            {/* Full background image */}
            <img
              src={heroImg}
              alt="PMNT workspace"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Centered content */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative z-10 flex flex-col items-center justify-center text-center px-8 h-full"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-[-0.03em] mb-5 text-white"
              >
                Your thoughts,<br />
                beautifully <span className="italic">organized</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="text-sm md:text-base text-white/75 max-w-md mb-10 leading-relaxed"
              >
                A premium markdown editor designed for clarity, crafted for writers
                who value focus and elegance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="flex gap-3"
              >
                <Link to="/editor">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] px-7 h-12 text-sm font-medium rounded-xl group transition-all duration-200">
                    Start writing
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/tutorial">
                  <Button size="lg" variant="outline" className="border-white/50 bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 hover:scale-[1.03] active:scale-[0.98] px-7 h-12 text-sm font-medium rounded-xl transition-all duration-200">
                    Learn MD
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ WHAT IS PMNT — Asymmetric intro ═══ */}
      <section className="px-6 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start"
          >
            <div>
              <motion.h2 variants={fadeUp} custom={0} className="font-serif text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] mb-5">
                What is PMNT?
              </motion.h2>
              <motion.div variants={fadeUp} custom={1}>
                <Link to="/editor">
                  <Button variant="outline" className="rounded-full px-6 h-10 text-sm font-medium border-foreground/20 hover:bg-foreground hover:text-background hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
                    Explore now
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-base md:text-lg leading-relaxed md:pt-2">
              PMNT is a privacy-first markdown editor that helps you write, organize, and export
              your notes, all from your browser with zero setup, no accounts, and no tracking.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURE CARDS — 3 columns with subtle colored backgrounds ═══ */}
      <section className="px-6 pb-10 md:pb-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                custom={i}
                className={`relative p-7 md:p-8 rounded-2xl border ${card.border} bg-gradient-to-br ${card.accent} overflow-hidden group hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500`}
              >
                <div className="mb-16 md:mb-24">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold mb-2 tracking-[-0.01em]">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">{card.description}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <card.icon className="h-5 w-5 text-foreground/70" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ ALL FEATURES — Clean grid ═══ */}
      <section className="px-6 py-10 md:py-14 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
              Features
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl md:text-4xl font-semibold tracking-[-0.01em] max-w-md">
              Everything you need,{" "}
              <span className="italic">nothing you don't</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8"
          >
            {allFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="flex gap-4 items-start group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-accent/15 group-hover:scale-110 transition-all duration-300">
                  <f.icon className="h-[18px] w-[18px] text-foreground/60 group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ EDITOR PREVIEW ═══ */}
      <section className="px-6 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
              Editor Preview
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl md:text-4xl font-semibold tracking-[-0.01em]">
              See it in action
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedEditorPreview />
          </motion.div>
        </div>
      </section>

      {/* ═══ WORKFLOW — Three steps ═══ */}
      <section className="px-6 py-10 md:py-14 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-14"
          >
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
                How it works
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl md:text-4xl font-semibold tracking-[-0.01em]">
                Three steps to clarity
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-base leading-relaxed md:pt-8">
              No setup, no sign-up. Open your browser, write in markdown, and export your notes in any format you need.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Open & Write", desc: "No sign-up. No setup. Just open the editor and start typing markdown." },
              { step: "02", title: "Organize & Tag", desc: "Create folders, drag notes, add colored tags. Find anything with Ctrl+K." },
              { step: "03", title: "Export & Share", desc: "Download as Markdown, HTML, or print to PDF. Always portable." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative p-7 rounded-2xl border border-border/40 bg-card/40 group hover:border-accent/20 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500"
              >
                <span className="font-serif text-6xl font-bold text-foreground/[0.04] absolute top-4 right-6 group-hover:text-accent/10 transition-colors duration-500">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <span className="inline-block text-[10px] font-semibold text-accent tracking-[0.15em] uppercase mb-4">Step {item.step}</span>
                  <h3 className="font-serif text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OPEN SOURCE BANNER ═══ */}
      <section className="px-6 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] via-background to-primary/[0.04] overflow-hidden p-10 md:p-14"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/[0.06] blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-primary/[0.04] blur-3xl" />

            <div className="relative z-10 text-center">
              <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
                Open Source
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl md:text-5xl font-semibold mb-5 tracking-[-0.01em]">
                100% free. Forever.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                No accounts, no subscriptions, no tracking. Your notes stay on your device, private by default.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[13px] text-foreground/70">
                {["Unlimited notes", "All features included", "No account required", "Privacy-first", "Works offline"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-accent" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="px-6 py-10 md:py-14 border-t border-border/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUp} custom={0} className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-[-0.02em]">
            Ready to write?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-base mb-10 max-w-md mx-auto leading-relaxed">
            No sign-up required. Open the editor and start writing immediately.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link to="/editor">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-10 h-12 text-sm font-medium rounded-full shadow-lg shadow-foreground/10 group">
                Open Editor
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
