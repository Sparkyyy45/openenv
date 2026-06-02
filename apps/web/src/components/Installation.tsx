"use client";
import { useState } from "react";
import { FadeIn } from "./FadeIn";

export default function Installation() {
  const [copied, setCopied] = useState(false);
  const code = "npm install -g Sparkyyy45/openenv\nopenenv init";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 lg:py-16 bg-bg-surface">
      <div className="max-w-[1120px] mx-auto px-6">
        <FadeIn delay={0.1}>
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-text-primary mb-3">
              Get started in seconds
            </h2>
            <p className="text-[16px] text-text-secondary">
              Install the CLI globally, then initialize your first project.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-[520px] mx-auto">
            <div className="relative bg-bg-primary rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F4F4F5] to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
                <span className="text-[12px] font-mono text-text-tertiary">
                  Terminal
                </span>
                <button
                  onClick={handleCopy}
                  className="text-[12px] text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-5">
                <pre className="font-mono text-[14px] leading-[2] text-text-primary relative z-10">
                  <div>
                    <span className="text-text-tertiary select-none">$ </span>
                    npm install -g Sparkyyy45/openenv
                  </div>
                  <div>
                    <span className="text-text-tertiary select-none">$ </span>
                    openenv init
                  </div>
                </pre>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
