import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Dashboard',
  description: 'Your application dashboard',
};

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-brand-700">
            {process.env.NEXT_PUBLIC_APP_NAME || 'SaaS App'}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user.email}. This is your protected dashboard.
          </p>
        </div>

        {/* ── Stats grid ───────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {[
            { label: 'Plan', value: 'Free', icon: '📋' },
            { label: 'API Calls', value: '0 / 1,000', icon: '📊' },
            { label: 'Status', value: 'Active', icon: '✅' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Quick actions ────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <h3 className="font-semibold text-gray-900">💳 Upgrade Plan</h3>
              <p className="mt-1 text-sm text-gray-600">
                Unlock more API calls and premium features with a Pro subscription.
              </p>
              <button className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98]">
                View Plans
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
              <h3 className="font-semibold text-gray-900">📚 Documentation</h3>
              <p className="mt-1 text-sm text-gray-600">
                Learn how to integrate with our API and build custom workflows.
              </p>
              <Link
                href="https://openenv.dev"
                target="_blank"
                className="mt-4 inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
              >
                Read Docs
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
