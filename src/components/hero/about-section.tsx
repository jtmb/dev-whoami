/**
 * About / Skills section — displays the DevOps skill set in categorized grids.
 * Server component with static data from src/data/skills.ts.
 * Each skill card shows an icon, name, and proficiency dots.
 */
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { getSkillsByCategory } from "@/data/skills";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export async function AboutSection() {
  const skillsByCategory = getSkillsByCategory();
  const categories = Object.keys(skillsByCategory);

  return (
    <SectionWrapper id="about" className="border-t border-border">
      <AnimatedReveal>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <GradientText>Skills &amp; Toolkit</GradientText>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          The tools and technologies I use to build, automate, and maintain
          infrastructure — from home labs to production clusters.
        </p>
      </AnimatedReveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, catIndex) => (
          <AnimatedReveal key={category} delay={catIndex * 0.1}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsByCategory[category].map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

/** Map icon name strings to Lucide icon components (defined at module scope to avoid creating during render). */
const ICON_MAP: Record<string, LucideIcon> = {
  Container: Icons.Container,
  Ship: Icons.Ship,
  Cog: Icons.Cog,
  Globe: Icons.Globe,
  Terminal: Icons.Terminal,
  Server: Icons.Server,
  Workflow: Icons.Workflow,
  GitBranch: Icons.GitBranch,
  FileTerminal: Icons.FileTerminal,
  GitGraph: Icons.GitGraph,
  FileCode: Icons.FileCode,
  FileJson: Icons.FileJson,
  Code: Icons.Code,
  TerminalSquare: Icons.TerminalSquare,
  FileCode2: Icons.FileCode2,
  Monitor: Icons.Monitor,
  Route: Icons.Route,
  Shield: Icons.Shield,
  Activity: Icons.Activity,
  BarChart3: Icons.BarChart3,
  Layers: Icons.Layers,
  Boxes: Icons.Boxes,
  HardDrive: Icons.HardDrive,
  Cpu: Icons.Cpu,
  Cloud: Icons.Cloud,
};

/** A skill badge showing the icon, name, and proficiency dots. */
function SkillBadge({
  skill,
}: {
  skill: { name: string; icon: string; proficiency: number };
}) {
  const IconComponent = ICON_MAP[skill.icon] || Icons.Code;

  return (
    <div className="group flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary/50 hover:bg-accent">
      <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
      <span className="font-medium">{skill.name}</span>
      {/* Proficiency dots */}
      <span className="ml-auto flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < skill.proficiency
                ? "bg-primary"
                : "bg-muted-foreground/20"
            }`}
          />
        ))}
      </span>
    </div>
  );
}
