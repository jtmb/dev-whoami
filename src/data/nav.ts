/**
 * Navigation configuration.
 * Central place for all nav links — used by both desktop navbar and mobile sheet.
 */
export interface NavLink {
  label: string;
  href: string;
  /** Optional Lucide icon name for visual nav items */
  icon?: string;
}

export const mainNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Repositories", href: "/repos" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: NavLink[] = [
  { label: "GitHub", href: "https://github.com/jtmb" },
];
