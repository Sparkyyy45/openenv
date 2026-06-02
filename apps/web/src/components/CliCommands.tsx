const commands = [
  {
    name: "openenv list",
    description: "Browse all available kits from the registry directly in your terminal.",
    code: "openenv list --tag saas",
  },
  {
    name: "openenv init",
    description: "Scaffold a kit into your project directory. Interactive by default.",
    code: "openenv init saas-nextjs-supabase",
  },
  {
    name: "openenv doctor",
    description: "Diagnose your local environment for Docker, Node, and port conflicts.",
    code: "openenv doctor --fix",
  },
  {
    name: "openenv deploy",
    description: "Generate deployment configurations (Dockerfiles, CI/CD) instantly.",
    code: "openenv deploy --provider render",
  },
];

export default function CliCommands() {
  return (
    <section className="py-12 lg:py-16 bg-bg-surface border-t border-border-primary">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-[32px] font-bold tracking-[-0.03em] text-text-primary mb-3">
            A bulletproof CLI
          </h2>
          <p className="text-[16px] text-text-secondary max-w-lg mx-auto">
            Everything you need to manage your environments, built into a single fast binary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {commands.map((cmd) => (
            <div
              key={cmd.name}
              className="bg-bg-primary border border-border-primary rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-[16px] font-mono font-semibold text-text-primary mb-1">
                    {cmd.name}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-text-secondary">
                    {cmd.description}
                  </p>
                </div>
              </div>
              <div className="bg-bg-terminal rounded-lg p-3 overflow-x-auto">
                <code className="text-[13px] font-mono text-[#E4E4E7] whitespace-pre">
                  <span className="text-[#71717A] select-none">$ </span>
                  {cmd.code}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
