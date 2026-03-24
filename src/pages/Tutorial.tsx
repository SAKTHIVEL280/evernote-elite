import { useState } from "react";
import { usePageSEO } from "@/hooks/use-page-seo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Keyboard, ChevronDown, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const syntaxExamples = [
  {
    title: "Headings",
    markdown: `# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4`,
  },
  {
    title: "Text Formatting",
    markdown: `**Bold text** and *italic text*\n\n~~Strikethrough~~ and \`inline code\`\n\nCombine them: ***bold and italic***`,
  },
  {
    title: "Lists",
    markdown: `Unordered:\n- First item\n- Second item\n  - Nested item\n\nOrdered:\n1. Step one\n2. Step two\n3. Step three`,
  },
  {
    title: "Links & Images",
    markdown: `[Visit PMNT](https://example.com)\n\n![Placeholder image](https://via.placeholder.com/300x150/f5f0e8/1c1c28?text=Your+Image)`,
  },
  {
    title: "Blockquotes",
    markdown: `> "The only way to do great work is to love what you do."\n>\n> — Steve Jobs`,
  },
  {
    title: "Code Blocks",
    markdown: "```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('World'));\n```",
  },
  {
    title: "Tables",
    markdown: `| Feature | Free | Pro |\n| ------- | ---- | --- |\n| Notes | Unlimited | Unlimited |\n| Sync | ❌ | ✅ |\n| Themes | Basic | Custom |`,
  },
  {
    title: "Task Lists",
    markdown: `- [x] Learn markdown basics\n- [x] Install PMNT\n- [ ] Write first note\n- [ ] Master keyboard shortcuts`,
  },
];

const shortcuts = [
  { keys: "Ctrl + B", action: "Bold" },
  { keys: "Ctrl + I", action: "Italic" },
  { keys: "Ctrl + K", action: "Insert Link" },
  { keys: "Ctrl + 1", action: "Heading 1" },
  { keys: "Ctrl + 2", action: "Heading 2" },
  { keys: "Ctrl + 3", action: "Heading 3" },
];

const tips = [
  { title: "Use headings to organize", detail: "Structure your notes with # for main topics, ## for subtopics. This makes notes scannable and easy to navigate." },
  { title: "Master keyboard shortcuts", detail: "Once you learn Ctrl+B, Ctrl+I, and Ctrl+K, you'll rarely need to touch the toolbar. Speed comes from keeping hands on keys." },
  { title: "Write first, format later", detail: "Don't stop to format while writing. Capture your thoughts first, then use markdown to organize and emphasize." },
  { title: "Use blockquotes for highlights", detail: "Blockquotes (>) are perfect for important takeaways, key quotes, or information you want to stand out." },
  { title: "Tables for structured data", detail: "Whenever you're comparing things or listing structured information, a table conveys it more clearly than paragraphs." },
];

const Tutorial = () => {
  usePageSEO({ title: "Markdown Tutorial", description: "Learn markdown syntax with interactive examples. Master headings, lists, code blocks, tables, and more.", path: "/tutorial" });
  const [openTip, setOpenTip] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm font-medium text-accent tracking-widest uppercase mb-4"
          >
            Tutorial
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-semibold mb-6"
          >
            Learn Markdown
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Master the essential syntax in minutes. Each example shows you the raw markdown and its rendered output side by side.
          </motion.p>
        </div>
      </section>

      {/* Syntax Examples */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-10">
          {syntaxExamples.map((ex, i) => (
            <motion.div
              key={ex.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              custom={i}
              className="rounded-xl border border-border overflow-hidden"
            >
              <div className="px-5 py-3 bg-muted/50 border-b border-border">
                <h3 className="font-serif text-lg font-semibold">{ex.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium">Markdown</p>
                  <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">{ex.markdown}</pre>
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium">Preview</p>
                  <div className="markdown-preview text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{ex.markdown}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="px-6 py-20 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-4">
              <Keyboard className="h-5 w-5 text-accent" />
              <p className="text-sm font-medium text-accent tracking-widest uppercase">Shortcuts</p>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl md:text-4xl font-semibold">
              Keyboard Reference
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {shortcuts.map((s, i) => (
              <motion.div
                key={s.action}
                variants={fadeUp}
                custom={i}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background"
              >
                <span className="text-sm">{s.action}</span>
                <kbd className="px-2.5 py-1 rounded bg-muted text-xs font-mono font-medium">{s.keys}</kbd>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tips */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-4">Tips & Tricks</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">Write like a pro</h2>
          </div>

          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/50 bg-background overflow-hidden"
              >
                <button
                  onClick={() => setOpenTip(openTip === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-sm">{tip.title}</span>
                  {openTip === i ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {openTip === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tutorial;
