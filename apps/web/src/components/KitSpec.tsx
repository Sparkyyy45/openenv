export default function KitSpec() {
  return (
    <section className="py-12 lg:py-16 border-t border-border-primary">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <h2 className="text-[32px] font-bold tracking-[-0.03em] text-text-primary mb-4">
              The Kit Specification
            </h2>
            <p className="text-[16px] leading-[1.6] text-text-secondary mb-8">
              Every kit in the openenv registry adheres to a strict, open
              specification. This ensures predictability across all stacks.
            </p>
            <ul className="space-y-6">
              {[
                {
                  file: "kit.json",
                  desc: "Metadata, dependencies, and health check definitions.",
                },
                {
                  file: ".env.example",
                  desc: "Fully documented environment variables required to run.",
                },
                {
                  file: "docker-compose.yml",
                  desc: "Infrastructure definitions (databases, caches).",
                },
                {
                  file: "setup.sh",
                  desc: "An idempotent script that handles migrations and installs.",
                },
              ].map((item, i) => (
                <li key={i}>
                  <div className="font-mono text-[14px] font-semibold text-text-primary mb-1">
                    {item.file}
                  </div>
                  <div className="text-[14px] text-text-secondary">
                    {item.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-bg-terminal rounded-xl p-6 shadow-sm border border-border-primary">
            <pre className="font-mono text-[13px] leading-[2] text-[#E4E4E7] overflow-x-auto">
              <span className="text-[#38BDF8]">kits/</span>
              <span className="text-[#A1A1AA]">saas-nextjs-supabase/</span>
              {"\n"}├── <span className="text-[#FBBF24]">kit.json</span>
              {"\n"}├── <span className="text-[#A3E635]">.env.example</span>
              {"\n"}├── <span className="text-[#A3E635]">docker-compose.yml</span>
              {"\n"}├── <span className="text-[#FBBF24]">setup.sh</span>
              {"\n"}├── <span className="text-[#A1A1AA]">README.md</span>
              {"\n"}└── <span className="text-[#38BDF8]">template/</span>
              {"\n"}    ├── src/
              {"\n"}    ├── package.json
              {"\n"}    └── ...
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
