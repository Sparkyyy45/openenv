import { FadeIn } from "./FadeIn";

export default function ProblemSolution() {
  return (
    <section className="py-12 lg:py-16 border-t border-border-primary">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-[20px] font-semibold text-text-primary mb-4">
                The problem
              </h2>
              <p className="text-[15px] leading-[1.7] text-text-secondary">
                Every new project starts the exact same way. You spend days
                setting up authentication, configuring a database, wiring up
                payments, writing Docker configs, and wrestling with CI pipelines.
                By the time you're ready to write your actual app, you're already
                exhausted.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div>
              <h2 className="text-[20px] font-semibold text-text-primary mb-4">
                The openenv way
              </h2>
              <p className="text-[15px] leading-[1.7] text-text-secondary mb-6">
                openenv is an open registry of production-ready starter kits powered
                by an ultra-fast CLI. Pick a stack, and we scaffold everything you
                need in seconds. Every kit comes pre-configured with:
              </p>
              <ul className="space-y-3">
                {[
                  "Working authentication (NextAuth, Supabase, JWT)",
                  "Database with migrations (Prisma, Drizzle)",
                  "Docker Compose for local dev",
                  "Idempotent setup scripts",
                  "Deployment-ready configurations",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[14px] text-text-secondary"
                  >
                    <svg
                      className="w-5 h-5 text-text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
