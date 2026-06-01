import Link from 'next/link';

export default function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'SaaS App';

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-brand-700">
            {appName}
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
            Built with openenv
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Ship your SaaS{' '}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              in days, not months
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Auth, payments, database, and deployment — all pre-configured.
            Focus on building features your customers love.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-lg active:scale-[0.98]"
            >
              Start Building →
            </Link>
            <Link
              href="https://openenv.dev/kits/saas-nextjs-supabase-stripe"
              target="_blank"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow-md active:scale-[0.98]"
            >
              Read the Docs
            </Link>
          </div>
        </div>

        {/* ── Feature cards ──────────────────────────────────────────── */}
        <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {[
            {
              icon: '🔐',
              title: 'Auth Ready',
              desc: 'Email/password and OAuth via Supabase Auth, protected routes out of the box.',
            },
            {
              icon: '💳',
              title: 'Stripe Payments',
              desc: 'Checkout sessions, webhooks, and subscription management pre-wired.',
            },
            {
              icon: '🗄️',
              title: 'PostgreSQL',
              desc: 'Supabase-managed Postgres with type-safe server and client helpers.',
            },
            {
              icon: '⚡',
              title: 'Next.js 14',
              desc: 'App Router, React Server Components, and server actions for peak performance.',
            },
            {
              icon: '🎨',
              title: 'Tailwind CSS',
              desc: 'Utility-first styling with a custom brand palette and dark mode ready.',
            },
            {
              icon: '🐳',
              title: 'Docker Compose',
              desc: 'One-command local stack: DB, API, Studio, and your app in containers.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          Built with{' '}
          <Link
            href="https://openenv.dev"
            target="_blank"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            openenv
          </Link>{' '}
          — the open standard for starter kits.
        </div>
      </footer>
    </div>
  );
}
