"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type ScriptLine = {
  text: string;
  delay: number;
  type: "input" | "output" | "success" | "blank";
};

const script: ScriptLine[] = [
  { text: "$ npm install -g openenv", delay: 400, type: "input" },
  { text: "", delay: 150, type: "blank" },
  { text: "$ openenv init", delay: 500, type: "input" },
  { text: "", delay: 100, type: "blank" },
  {
    text: "? Which kit? (Use arrow keys)",
    delay: 300,
    type: "output",
  },
  {
    text: "❯ saas-nextjs-supabase-stripe",
    delay: 150,
    type: "output",
  },
  {
    text: "  api-fastapi-postgres-redis",
    delay: 50,
    type: "output",
  },
  { text: "  mern-stack-auth", delay: 50, type: "output" },
  { text: "", delay: 200, type: "blank" },
  { text: "✓ Authentication", delay: 100, type: "success" },
  { text: "✓ PostgreSQL + Prisma", delay: 100, type: "success" },
  { text: "✓ Docker Compose", delay: 100, type: "success" },
  { text: "✓ Stripe integration", delay: 100, type: "success" },
  { text: "", delay: 200, type: "blank" },
  {
    text: "Done. Run `cd my-app && npm run dev` to start.",
    delay: 300,
    type: "output",
  },
];

export default function TerminalDemo() {
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let current = 0;
    let active = true;

    setLines([]);
    setDone(false);

    const run = async () => {
      while (current < script.length && active) {
        await new Promise((r) => setTimeout(r, script[current].delay));
        if (!active) break;
        const line = script[current];
        setLines((prev) => [...prev, line]);
        current++;
      }
      if (active) setDone(true);
    };

    run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="pb-8 lg:pb-12">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div 
          className="max-w-[760px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.3 } }}
        >
            <div className="rounded-xl overflow-hidden border border-border-primary shadow-[0_4px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-shadow duration-500">
              {/* Terminal header */}
              <div className="bg-[#27272A] px-4 py-3 flex items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3F3F46]" />
                  <div className="w-3 h-3 rounded-full bg-[#3F3F46]" />
                  <div className="w-3 h-3 rounded-full bg-[#3F3F46]" />
                </div>
                <span className="flex-1 text-center text-[12px] font-mono text-[#71717A] -ml-10">
                  Terminal
                </span>
              </div>

              {/* Terminal body */}
              <div className="bg-bg-terminal p-6 font-mono text-[13.5px] leading-[1.75] min-h-[360px]">
                {lines.map((line, i) => {
                  if (line.type === "blank")
                    return <div key={i} className="h-[24px]" />;

                  if (line.type === "input")
                    return (
                      <div key={i} className="text-[#E4E4E7]">
                        {line.text}
                      </div>
                    );

                  if (line.type === "success")
                    return (
                      <div key={i} className="text-[#4ADE80]">
                        {line.text}
                      </div>
                    );

                  const isHighlighted = line.text.startsWith("❯");
                  return (
                    <div
                      key={i}
                      className={
                        isHighlighted ? "text-[#E4E4E7]" : "text-[#71717A]"
                      }
                    >
                      {line.text}
                    </div>
                  );
                })}

                {!done && (
                  <span className="inline-block w-[8px] h-[16px] bg-[#71717A] animate-pulse align-middle" />
                )}
              </div>
            </div>
          </motion.div>
      </div>
    </section>
  );
}
