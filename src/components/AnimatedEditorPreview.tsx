import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const markdownLines = [
  { text: "# Meeting Notes", delay: 0 },
  { text: "", delay: 200 },
  { text: "## Key Decisions", delay: 400 },
  { text: "", delay: 500 },
  { text: "- Launch date set for **March 15th**", delay: 600 },
  { text: "- Budget approved for Q2 campaign", delay: 900 },
  { text: "- New hire starts *next Monday*", delay: 1200 },
  { text: "", delay: 1400 },
  { text: "## Action Items", delay: 1600 },
  { text: "", delay: 1700 },
  { text: "1. Finalize design mockups", delay: 1800 },
  { text: "2. Review analytics dashboard", delay: 2100 },
  { text: "3. Schedule team retrospective", delay: 2400 },
  { text: "", delay: 2600 },
  { text: "> Great meeting, team! 🎉", delay: 2800 },
];

const renderedContent = [
  { type: "h1", text: "Meeting Notes", delay: 100 },
  { type: "h2", text: "Key Decisions", delay: 500 },
  { type: "li", text: "Launch date set for <strong>March 15th</strong>", delay: 700 },
  { type: "li", text: "Budget approved for Q2 campaign", delay: 1000 },
  { type: "li", text: "New hire starts <em>next Monday</em>", delay: 1300 },
  { type: "h2", text: "Action Items", delay: 1700 },
  { type: "ol", text: "Finalize design mockups", delay: 1900 },
  { type: "ol", text: "Review analytics dashboard", delay: 2200 },
  { type: "ol", text: "Schedule team retrospective", delay: 2500 },
  { type: "quote", text: "Great meeting, team! 🎉", delay: 2900 },
];

const TypingLine = ({ text, startDelay, isActive }: { text: string; startDelay: number; isActive: boolean }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (text === "") {
      const t = setTimeout(() => setDone(true), startDelay);
      return () => clearTimeout(t);
    }
    let i = 0;
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 25 + Math.random() * 20);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(start);
  }, [isActive, text, startDelay]);

  if (!isActive && !done) return null;
  if (text === "" && done) return <div className="h-4" />;

  return (
    <div className="flex items-start">
      <span className="text-muted-foreground">{displayed}</span>
      {!done && <span className="inline-block w-[2px] h-4 bg-accent ml-[1px] animate-pulse" />}
    </div>
  );
};

const RenderedLine = ({ type, text, delay, isActive }: { type: string; text: string; delay: number; isActive: boolean }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setShow(true), delay + 100);
    return () => clearTimeout(t);
  }, [isActive, delay]);

  if (!show) return null;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {type === "h1" && <h1 className="font-serif text-xl md:text-2xl font-bold mb-3 text-foreground">{text}</h1>}
      {type === "h2" && <h2 className="font-serif text-sm md:text-base font-bold mb-2 mt-3 text-foreground/90">{text}</h2>}
      {type === "li" && (
        <div className="flex items-start gap-2 text-foreground/80 mb-1">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
      {type === "ol" && (
        <div className="flex items-start gap-2 text-foreground/80 mb-1">
          <span className="text-foreground/40 shrink-0 font-mono text-xs mt-0.5">{text.includes("Finalize") ? "1." : text.includes("Review") ? "2." : "3."}</span>
          <span>{text}</span>
        </div>
      )}
      {type === "quote" && (
        <blockquote className="border-l-[3px] border-accent pl-4 italic text-muted-foreground mt-3">
          {text}
        </blockquote>
      )}
    </motion.div>
  );

  return content;
};

export const AnimatedEditorPreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-[0_30px_80px_-20px] shadow-foreground/[0.08] group hover:shadow-[0_40px_100px_-20px] hover:shadow-foreground/[0.12] transition-shadow duration-700">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-[11px] text-muted-foreground font-mono px-3 py-0.5 rounded-md bg-foreground/[0.04]">meeting-notes.md</span>
          </div>
          <div className="w-[54px]" />
        </div>
        {/* Split panes */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
          {/* Markdown side - typing animation */}
          <div className="p-6 md:p-7 font-mono text-[12px] md:text-[13px] leading-[1.9] min-h-[280px]">
            {markdownLines.map((line, i) => (
              <TypingLine key={i} text={line.text} startDelay={line.delay} isActive={isInView} />
            ))}
          </div>
          {/* Preview side - rendered content appearing */}
          <div className="p-6 md:p-7 text-[12px] md:text-[13px] leading-[1.9] min-h-[280px] hidden md:block">
            {renderedContent.map((item, i) => (
              <RenderedLine key={i} type={item.type} text={item.text} delay={item.delay} isActive={isInView} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
