import { FadeIn } from "./FadeIn";

const features = [
  {
    title: "Verified by CI",
    description:
      "Every kit is tested in CI before it reaches the registry. Setup scripts, health checks, and dependency installs are validated on every commit.",
  },
  {
    title: "Docker by default",
    description:
      "Each kit includes a pre-configured docker-compose.yml for databases, caches, and any infrastructure dependencies your stack needs.",
  },
  {
    title: "Idempotent setup",
    description:
      "Run the setup script as many times as you want. It handles migrations, seed data, and dependency installs without breaking.",
  },
  {
    title: "Open specification",
    description:
      "Every kit follows a strict, documented spec: kit.json for metadata, .env.example for variables, setup.sh for one-command bootstrapping.",
  },
];

export default function TechnicalFeatures() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-[1120px] mx-auto px-6">
        <FadeIn delay={0.1}>
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-text-primary mb-3">
              How it works
            </h2>
            <p className="text-[16px] text-text-secondary max-w-lg mx-auto">
              Every kit follows the same strict standard so you can trust it before you run it.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={0.1 + index * 0.1}>
              <div
                className="border border-border-primary rounded-xl p-6 bg-bg-surface hover:bg-bg-code hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-[16px] font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
