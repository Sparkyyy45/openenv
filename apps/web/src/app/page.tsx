import Hero from "@/components/Hero";
import TerminalDemo from "@/components/TerminalMockup";
import ProblemSolution from "@/components/ProblemSolution";
import StarterKits from "@/components/StarterKits";
import TechnicalFeatures from "@/components/TechnicalFeatures";
import CliCommands from "@/components/CliCommands";
import KitSpec from "@/components/KitSpec";
import Roadmap from "@/components/Roadmap";
import Installation from "@/components/Installation";
import GitHubCTA from "@/components/GitHubCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <TerminalDemo />
      <ProblemSolution />
      <StarterKits />
      <TechnicalFeatures />
      <CliCommands />
      <KitSpec />
      <Roadmap />
      <Installation />
      <GitHubCTA />

      <footer className="border-t border-border-primary py-8 bg-bg-surface">
        <div className="max-w-[1120px] mx-auto px-6 flex justify-between items-center">
          <p className="text-[13px] text-text-tertiary">
            © {new Date().getFullYear()} openenv
          </p>
          <p className="text-[13px] text-text-tertiary">MIT License</p>
        </div>
      </footer>
    </main>
  );
}
