"use client";

/**
 * Skills Filter Client — combines the interactive SkillsFilter (search + category tabs)
 * with the filtered skills grid. This Client Component receives skill data from the
 * parent Server Component (AboutSection) and manages filter state locally.
 */
import { useMemo, useState } from "react";
import { SkillsFilter, type FilterableSkill } from "./skills-filter";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type { FilterableSkill };

interface SkillsFilterClientProps {
  skills: FilterableSkill[];
}

/** Map icon name strings to Lucide icon components (defined at module scope). */
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
function SkillBadge({ skill }: { skill: FilterableSkill }) {
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

export function SkillsFilterClient({ skills }: SkillsFilterClientProps) {
  const [filteredNames, setFilteredNames] = useState(() => new Set(skills.map((s) => s.name)));

  // Compute which skills to display based on filter state.
  const visibleSkills = useMemo(() => {
    return skills.filter((skill) => filteredNames.has(skill.name));
  }, [skills, filteredNames]);

  // Group visible skills by category for the grid layout.
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, FilterableSkill[]> = {};
    for (const skill of visibleSkills) {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    }
    return groups;
  }, [visibleSkills]);

  const categories = Object.keys(groupedByCategory);

  return (
    <>
      {/* Filter bar */}
      <div className="mb-8">
        <SkillsFilter skills={skills} onFilterChange={setFilteredNames} />
      </div>

      {/* Skills grid — grouped by category */}
      {categories.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {groupedByCategory[category].map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-muted-foreground">
          No skills match the current filters.
        </p>
      )}
    </>
  );
}