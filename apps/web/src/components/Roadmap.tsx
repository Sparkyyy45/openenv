const roadmapItems = [
  {
    feature: "openenv add <feature>",
    description: "Inject features (Stripe, Redis, Tailwind) directly into existing projects without scaffolding a full kit.",
  },
  {
    feature: "Custom GitHub Repositories",
    description: "Run openenv init username/repo to scaffold from any public repository using openenv's robust checks.",
  },
  {
    feature: "Cloud Environment Sync",
    description: "Securely pull secrets from Vercel or a centralized vault so you never have to copy-paste API keys.",
  },
  {
    feature: "Auto-provisioning",
    description: "Native integrations with Vercel and Railway APIs to automatically provision live databases and hosting.",
  },
];

export default function Roadmap() {
  return (
    <section className="py-12 lg:py-16 bg-bg-surface border-t border-border-primary">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-[32px] font-bold tracking-[-0.03em] text-text-primary mb-3">
            What's next
          </h2>
          <p className="text-[16px] text-text-secondary max-w-lg mx-auto">
            We are constantly improving openenv. Here is our roadmap.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {roadmapItems.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-bg-primary border border-border-primary rounded-xl"
            >
              <div className="w-6 h-6 rounded-full bg-border-subtle flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-semibold text-text-secondary">
                {i + 1}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-text-primary mb-1">
                  {item.feature}
                </h3>
                <p className="text-[14px] leading-[1.6] text-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
