import { getRegistry } from "@/lib/registry";
import KitCard from "@/components/KitCard";

export const metadata = {
  title: "Starter Kits — openenv",
  description:
    "Browse all production-ready full-stack starter kits available on openenv.",
};

export default async function KitsPage() {
  const kits = await getRegistry();

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="mb-12">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-text-primary mb-2">
            Starter Kits
          </h1>
          <p className="text-[15px] text-text-secondary">
            Production-ready, CI-verified starter kits.
          </p>
        </div>

        {kits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kits.map((kit) => (
              <KitCard key={kit.name} kit={kit} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-border-primary rounded-lg">
            <p className="text-text-tertiary text-[14px]">
              No kits found in the registry.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
