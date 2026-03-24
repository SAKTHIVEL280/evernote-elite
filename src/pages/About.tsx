import { motion } from "framer-motion";
import { usePageSEO } from "@/hooks/use-page-seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Heart, Target, Sparkles, Code2, ArrowUpRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const values = [
  { icon: Target, title: "Focus", description: "Built to help you concentrate on what matters — your writing, nothing else." },
  { icon: Sparkles, title: "Craft", description: "Every pixel, every interaction is considered. Good tools should feel invisible." },
  { icon: Heart, title: "Simplicity", description: "Powerful doesn't mean complicated. The best features are the ones you barely notice." },
  { icon: Code2, title: "Open Source", description: "PMNT is free and open-source. Inspect, fork, contribute — it's yours." },
];

const timeline = [
  { year: "The Problem", event: "Searched for a better note-taking app — something clean, easy to access, and markdown-first. Couldn't find one that felt right." },
  { year: "The Idea", event: "Decided to stop searching and start building. If the perfect tool doesn't exist, why not create it?" },
  { year: "The Build", event: "Built PMNT from scratch with Lovable — an AI-powered development platform that turned the vision into reality." },
  { year: "The Result", event: "A free, privacy-first markdown editor that works entirely in your browser. No accounts, no cloud, no compromises." },
];

const About = () => {
  usePageSEO({ title: "About", description: "PMNT was built by Sakthivel with Lovable — a solo dev's quest for the perfect markdown note-taking app.", path: "/about" });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm font-medium text-accent tracking-widest uppercase mb-6"
          >
            About PMNT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-8"
          >
            A solo dev's quest for the{" "}
            <span className="italic text-accent">perfect</span>{" "}
            note-taking app
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            I'm Sakthivel. I wanted a markdown note-taking app that was clean, fast, and easy to access — but couldn't find one. So I built my own, with the help of Lovable.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-serif text-3xl md:text-4xl font-semibold">
              What drives PMNT
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex gap-5 p-6 rounded-xl border border-border/50 bg-background"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <v.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Builder */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
              Behind PMNT
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl md:text-4xl font-semibold">
              Built by Sakthivel × Lovable
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-10 items-center"
          >
            <motion.div variants={fadeUp} custom={0} className="text-center md:text-left flex-1">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="font-serif text-2xl font-semibold text-accent">SE</span>
              </div>
              <h3 className="font-medium text-xl mb-1">Sakthivel</h3>
              <p className="text-sm text-muted-foreground mb-4">Solo Developer & Creator</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                I was frustrated with bloated note-taking apps that did everything except let me write in peace. 
                So I built PMNT — a clean, privacy-first markdown editor — entirely with the help of{" "}
                <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Lovable
                </a>, an AI-powered development platform. No team, no funding — just an idea and the right tool to bring it to life.
              </p>
              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                <a
                  href="https://sakthivel.daeq.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-accent hover:underline"
                >
                  sakthivel.daeq.in <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://daeq.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-accent hover:underline"
                >
                  daeq.in <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sakthivel-e-1924a0292/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-accent hover:underline"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://x.com/SAKTHIVEL_E_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-accent hover:underline"
                >
                  X <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey */}
      <section className="px-6 py-20 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
              The Journey
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl md:text-4xl font-semibold">
              How PMNT came to be
            </motion.h2>
          </motion.div>

          <div className="space-y-0">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex gap-6 py-5"
              >
                <div className="w-28 shrink-0">
                  <span className="text-sm font-mono font-medium text-accent">{t.year}</span>
                </div>
                <div className="flex-1 border-l border-border pl-6 relative">
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent" />
                  <p className="text-sm leading-relaxed">{t.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">Get in touch</h2>
          <p className="text-muted-foreground mb-8">
            Have feedback, ideas, or just want to say hello? I'd love to hear from you.
          </p>
          <a
            href="mailto:hello@daeq.in"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            hello@daeq.in
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
