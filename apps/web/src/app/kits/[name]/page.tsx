import { getKitByName, getRegistry } from "@/lib/registry";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const kits = await getRegistry();
  return kits.map((kit) => ({
    name: kit.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const kit = await getKitByName(name);

  if (!kit) {
    return { title: "Kit Not Found" };
  }

  return {
    title: `${kit.name} — openenv`,
    description: kit.description,
  };
}

export default async function KitDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const kit = await getKitByName(name);

  if (!kit) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-[1080px] mx-auto">
        <Link
          href="/kits"
          className="inline-flex items-center text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-10"
        >
          <svg
            className="w-3.5 h-3.5 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Kits
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-8 border-b border-border-primary">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-text-primary">
                {kit.name}
              </h1>
              {kit.verified && (
                <span
                  className="text-text-tertiary"
                  title="Verified by openenv CI"
                >
                  <svg
                    className="w-5 h-5"
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
                </span>
              )}
            </div>
            <p className="text-[15px] text-text-secondary">
              {kit.description}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="px-3 py-2 bg-bg-code border border-border-primary rounded-md font-mono text-[13px] text-text-primary">
              $ openenv init {kit.name}
            </div>
            <p className="text-[11px] text-text-tertiary">
              v{kit.version || "1.0.0"} · by {kit.author}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-4">
                Tech Stack
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(kit.tech).map(([category, technology]) => (
                  <div
                    key={category}
                    className="bg-bg-surface rounded-lg p-4 border border-border-primary"
                  >
                    <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1 capitalize">
                      {category}
                    </h3>
                    <p className="text-[14px] text-text-primary font-medium">
                      {technology as string}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {kit.setup_commands && kit.setup_commands.length > 0 && (
              <section>
                <h2 className="text-[16px] font-medium text-text-primary mb-4">
                  Setup Commands
                </h2>
                <div className="bg-bg-terminal rounded-lg p-4 font-mono text-[13px] text-[#E5E5E5] overflow-x-auto">
                  {kit.setup_commands.map((cmd, idx) => (
                    <div key={idx} className="mb-1.5 last:mb-0">
                      <span className="text-[#737373] select-none">$ </span>
                      {cmd}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {kit.health_check && (
              <section>
                <h2 className="text-[16px] font-medium text-text-primary mb-4">
                  Health Check
                </h2>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-bg-surface rounded-lg px-4 py-3 border border-border-primary flex-1 min-w-[200px]">
                    <p className="text-[11px] text-text-tertiary mb-1">
                      Endpoint
                    </p>
                    <code className="text-[13px] text-text-primary font-mono">
                      {kit.health_check.url}
                    </code>
                  </div>
                  <div className="bg-bg-surface rounded-lg px-4 py-3 border border-border-primary w-28">
                    <p className="text-[11px] text-text-tertiary mb-1">
                      Expected
                    </p>
                    <p className="text-[13px] text-text-primary font-mono">
                      {kit.health_check.expected_status}
                    </p>
                  </div>
                  <div className="bg-bg-surface rounded-lg px-4 py-3 border border-border-primary w-28">
                    <p className="text-[11px] text-text-tertiary mb-1">
                      Timeout
                    </p>
                    <p className="text-[13px] text-text-primary font-mono">
                      {kit.health_check.timeout_seconds}s
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-5">
              <h3 className="text-[13px] font-medium text-text-primary mb-3">
                Required Ports
              </h3>
              <div className="flex flex-wrap gap-2">
                {kit.required_ports.map((port) => (
                  <span
                    key={port}
                    className="px-2.5 py-1 rounded-md bg-bg-surface border border-border-primary text-[12px] text-text-secondary font-mono"
                  >
                    {port}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-border-primary rounded-lg p-5">
              <h3 className="text-[13px] font-medium text-text-primary mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {kit.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-bg-surface border border-border-subtle rounded text-[11px] font-medium text-text-tertiary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={`${kit.repo}/tree/main/${kit.template_path}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-text-inverse rounded-lg text-center text-[13px] font-medium transition-colors"
            >
              View Source →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
