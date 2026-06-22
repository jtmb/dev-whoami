/**
 * Curated featured projects — hand-maintained selection of portfolio highlights.
 * These are displayed on the /projects page with rich cards and descriptions.
 *
 * To add a project: add an entry to the array below. The `stars` field
 * is filled dynamically at build time via GitHub API ISR.
 */
import type { FeaturedProject } from "@/lib/types";

export const featuredProjects: FeaturedProject[] = [
  {
    name: "arr-stack-4-dummies",
    description:
      "Simple Docker Compose configuration for popular media management tools — Radarr, Sonarr, Prowlarr, and more. Template repo designed to get beginners up and running with a full media automation stack in minutes.",
    repoUrl: "https://github.com/jtmb/arr-stack-4-dummies",
    tags: ["Docker", "Docker Compose", "Self-Hosted", "Media"],
    featured: true,
    category: "Self-Hosted",
  },
  {
    name: "branconet-homelab",
    description:
      "A highly customizable Ansible home lab cluster deployment. Automates the full provisioning of a homelab environment with Docker, monitoring, networking, and service orchestration. 12+ open issues tracking active development.",
    repoUrl: "https://github.com/jtmb/branconet-homelab",
    tags: ["Ansible", "Docker", "Homelab", "Automation"],
    featured: true,
    category: "DevOps",
  },
  {
    name: "ansible-rke2-rancher",
    description:
      "One-command setup for a production-ready RKE2 Kubernetes cluster with Rancher UI and Let's Encrypt TLS. Automates the entire K8s bootstrap process from bare metal to operational cluster.",
    repoUrl: "https://github.com/jtmb/ansible-rke2-rancher",
    tags: ["Kubernetes", "RKE2", "Rancher", "Ansible", "TLS"],
    featured: true,
    category: "DevOps",
  },
  {
    name: "ez-backups",
    description:
      "Keep your Docker self-hosted environment backed up — the easy way. Automated backup solution for Docker volumes, configurations, and databases with minimal configuration required.",
    repoUrl: "https://github.com/jtmb/ez-backups",
    tags: ["Docker", "Backup", "Shell", "Automation"],
    featured: true,
    category: "DevOps",
  },
  {
    name: "dev-box",
    description:
      "Docker-based Ubuntu DevOps environment. Spin up a fully-configured development box with all the tools you need — Terraform, kubectl, Helm, Ansible, and more — in a single container.",
    repoUrl: "https://github.com/jtmb/dev-box",
    tags: ["Docker", "DevOps", "Ubuntu", "Tooling"],
    featured: true,
    category: "DevOps",
  },
  {
    name: "copilot-ai-bootstrap",
    description:
      "Automated AI coding conventions bootstrap system. Detects your project framework and injects tailored AGENTS.md rules, CI workflows, prompt templates, and documentation scaffolds.",
    repoUrl: "https://github.com/jtmb/copilot-ai-bootstrap",
    tags: ["AI", "Automation", "Developer Tools", "CI/CD"],
    featured: true,
    category: "AI",
  },
  {
    name: "browser-agent-extension",
    description:
      "Browser automation agent extension. Leverages AI to navigate and interact with web pages programmatically — designed for testing, scraping, and automated workflows.",
    repoUrl: "https://github.com/jtmb/browser-agent-extension",
    tags: ["JavaScript", "Browser", "AI", "Automation"],
    featured: false,
    category: "AI",
  },
  {
    name: "jackal",
    description:
      "Wayland gaming optimizer for Linux. Maximizes gaming performance with automatic VRR/HDR management, service suspension, and GPU tuning — all from the terminal.",
    repoUrl: "https://github.com/jtmb/jackal",
    tags: ["Linux", "Gaming", "Wayland", "Shell", "Performance"],
    featured: false,
    category: "Gaming",
  },
  {
    name: "hookie",
    description:
      "Security audit tool that scans repositories for exposed Discord webhooks. Helps developers catch accidentally committed secrets before they're exploited.",
    repoUrl: "https://github.com/jtmb/hookie",
    tags: ["Security", "Shell", "GitHub", "Audit"],
    featured: false,
    category: "Automation",
  },
  {
    name: "cardventory",
    description:
      "Inventory management application with active development (7 open issues). Built with TypeScript and modern tooling.",
    repoUrl: "https://github.com/jtmb/cardventory",
    tags: ["TypeScript", "Web", "Inventory"],
    featured: false,
    category: "Web",
  },
];
