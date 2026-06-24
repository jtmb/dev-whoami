/**
 * About / Skills section — Server Component that fetches static skill data
 * and delegates rendering to a Client Component for interactive filtering.
 */
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { skills as allSkills } from "@/data/skills";
import type { FilterableSkill } from "./skills-filter-client";
import { SkillsFilterClient } from "./skills-filter-client";

export async function AboutSection() {
  // Convert static skill data to filter-compatible shape for the Client Component.
  const filterableSkills: FilterableSkill[] = allSkills.map((skill) => ({
    name: skill.name,
    icon: skill.icon,
    category: skill.category,
    proficiency: skill.proficiency,
  }));

  return (
    <SectionWrapper id="about" className="border-t border-border">
      <AnimatedReveal>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <GradientText>Skills & Toolkit</GradientText>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          The tools and technologies I use to build, automate, and maintain
          infrastructure — from home labs to production clusters.
        </p>
      </AnimatedReveal>

      {/* Interactive filter + skills grid */}
      <div className="mt-10">
        <SkillsFilterClient skills={filterableSkills} />
      </div>
    </SectionWrapper>
  );
}