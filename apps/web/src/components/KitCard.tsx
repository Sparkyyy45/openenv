import Link from "next/link";
import { Kit } from "@/lib/registry";

export default function KitCard({ kit }: { kit: Kit }) {
  return (
    <Link href={`/kits/${kit.name}`} className="group block">
      <div className="border border-border-primary rounded-lg p-5 transition-colors hover:border-text-tertiary">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-mono text-[13px] font-medium text-text-primary">
            {kit.name}
          </h3>
          {kit.verified && (
            <span
              className="text-text-tertiary"
              title="Verified Kit"
            >
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          )}
        </div>

        <p className="text-[14px] text-text-secondary mb-4 line-clamp-2">
          {kit.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {kit.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-medium text-text-tertiary bg-bg-surface border border-border-subtle rounded"
            >
              {tag}
            </span>
          ))}
          {kit.tags.length > 4 && (
            <span className="px-2 py-0.5 text-[11px] text-text-tertiary">
              +{kit.tags.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
