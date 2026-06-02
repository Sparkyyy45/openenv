import { FadeIn } from "./FadeIn";

export default function GitHubCTA() {
  return (
    <section className="py-12 lg:py-16 border-t border-border-primary">
      <div className="max-w-[1120px] mx-auto px-6 text-center">
        <FadeIn delay={0.1}>
          <h2 className="text-[32px] font-bold tracking-[-0.03em] text-text-primary mb-4">
            Open source
          </h2>
          <p className="text-[16px] leading-[1.65] text-text-secondary max-w-lg mx-auto mb-8">
            The registry, CLI, and all starter kits are fully open source.
            Contributions are welcome.
          </p>
          <div className="flex justify-center">
            <a
              href="https://github.com/Sparkyyy45/openenv"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-hover text-text-inverse text-[15px] font-medium rounded-lg transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              View on GitHub
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
