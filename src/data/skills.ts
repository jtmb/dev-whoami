/**
 * Skills catalog for the About section.
 * Each skill has a name, Lucide icon reference, category, and proficiency (1-5).
 *
 * Icons reference: https://lucide.dev/icons/
 * For tools not in Lucide, we use the closest conceptual match.
 */
import type { Skill } from "@/lib/types";

export const skills: Skill[] = [
  // Infrastructure
  { name: "Docker", icon: "Container", category: "Infrastructure", proficiency: 5 },
  { name: "Kubernetes", icon: "Ship", category: "Infrastructure", proficiency: 4 },
  { name: "Ansible", icon: "Cog", category: "Infrastructure", proficiency: 5 },
  { name: "Terraform", icon: "Globe", category: "Infrastructure", proficiency: 3 },
  { name: "Linux", icon: "Terminal", category: "Infrastructure", proficiency: 5 },
  { name: "Nginx", icon: "Server", category: "Infrastructure", proficiency: 4 },

  // CI/CD & Automation
  { name: "GitHub Actions", icon: "Workflow", category: "CI/CD & Automation", proficiency: 5 },
  { name: "CI/CD Pipelines", icon: "GitBranch", category: "CI/CD & Automation", proficiency: 4 },
  { name: "Shell Scripting", icon: "FileTerminal", category: "CI/CD & Automation", proficiency: 5 },
  { name: "Git", icon: "GitGraph", category: "CI/CD & Automation", proficiency: 5 },

  // Languages
  { name: "TypeScript", icon: "FileCode", category: "Languages", proficiency: 4 },
  { name: "JavaScript", icon: "FileJson", category: "Languages", proficiency: 4 },
  { name: "Python", icon: "Code", category: "Languages", proficiency: 4 },
  { name: "Bash", icon: "TerminalSquare", category: "Languages", proficiency: 5 },
  { name: "PHP", icon: "FileCode2", category: "Languages", proficiency: 2 },
  { name: "PowerShell", icon: "Terminal", category: "Languages", proficiency: 3 },

  // Tools
  { name: "VS Code", icon: "Monitor", category: "Tools", proficiency: 5 },
  { name: "Traefik", icon: "Route", category: "Tools", proficiency: 4 },
  { name: "Pi-hole", icon: "Shield", category: "Tools", proficiency: 3 },
  { name: "Prometheus", icon: "Activity", category: "Tools", proficiency: 3 },
  { name: "Grafana", icon: "BarChart3", category: "Tools", proficiency: 3 },

  // Platforms
  { name: "Rancher", icon: "Layers", category: "Platforms", proficiency: 4 },
  { name: "RKE2", icon: "Boxes", category: "Platforms", proficiency: 4 },
  { name: "Proxmox", icon: "HardDrive", category: "Platforms", proficiency: 4 },
  { name: "Raspberry Pi", icon: "Cpu", category: "Platforms", proficiency: 4 },
  { name: "Vercel", icon: "Cloud", category: "Platforms", proficiency: 3 },
];

/** Group skills by category for display in the About section. */
export function getSkillsByCategory(): Record<string, Skill[]> {
  const grouped: Record<string, Skill[]> = {};
  for (const skill of skills) {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
    }
    grouped[skill.category].push(skill);
  }
  return grouped;
}
