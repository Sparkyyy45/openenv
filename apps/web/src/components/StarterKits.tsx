import Link from "next/link";
import { FadeIn } from "./FadeIn";

const kits = [
  {
    name: "saas-nextjs-supabase-stripe",
    description: "Full SaaS starter with auth, payments, and dashboard",
    stack: ["Next.js", "Supabase", "Stripe", "Tailwind"],
  },
  {
    name: "api-fastapi-postgres-redis",
    description: "Production API with async CRUD, caching, and tests",
    stack: ["FastAPI", "PostgreSQL", "Redis"],
  },
  {
    name: "mern-stack-auth",
    description: "MERN stack with JWT authentication and Docker MongoDB",
    stack: ["React", "Express", "MongoDB"],
  },
  {
    name: "t3-app-router",
    description: "Type-safe full-stack with App Router",
    stack: ["Next.js 14", "tRPC", "Prisma", "Tailwind"],
  },
  {
    name: "django-react-postgres",
    description: "Django REST backend with React frontend",
    stack: ["Django", "React", "PostgreSQL"],
  },
  {
    name: "go-gin-postgres-api",
    description: "High-performance Go API",
    stack: ["Go", "Gin", "PostgreSQL"],
  },
  {
    name: "express-prisma-sqlite",
    description: "Fastest Node.js API setup with zero-config database",
    stack: ["Express", "Prisma", "SQLite"],
  },
  {
    name: "vue-vite-firebase",
    description: "Serverless frontend with Firebase auth and database",
    stack: ["Vue 3", "Vite", "Firebase"],
  },
];

export default function StarterKits() {
  return (
    <section className="py-12 lg:py-16 bg-bg-surface">
      <div className="max-w-[1120px] mx-auto px-6">
        <FadeIn delay={0.1}>
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-text-primary mb-3">
              Production-ready starter kits
            </h2>
            <p className="text-[16px] text-text-secondary max-w-2xl mx-auto">
              Stop reinventing the wheel. Start with a verified stack that
              includes auth, databases, payments, and deployment.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kits.map((kit, index) => (
            <FadeIn key={kit.name} delay={0.1 + index * 0.05}>
              <Link
                href={`/kits/${kit.name}`}
                className="group block p-6 bg-bg-primary rounded-xl border border-border-primary hover:border-border-subtle transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-bg-code flex items-center justify-center text-text-primary border border-border-primary group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-text-primary text-[15px] group-hover:text-black transition-colors">
                    {kit.name}
                  </h3>
                </div>
                <p className="text-[14px] leading-relaxed text-text-secondary mb-6 group-hover:text-text-primary transition-colors">
                  {kit.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {kit.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-[12px] font-medium text-text-secondary bg-bg-surface border border-border-primary rounded-md group-hover:bg-bg-code transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/kits"
            className="text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            View all kits →
          </Link>
        </div>
      </div>
    </section>
  );
}
