import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/nav/navbar";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/shared/back-to-top";
import { AnimatedGradient } from "@/components/shared/animated-gradient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "James — DevOps Engineer & Homelab Enthusiast",
    template: "%s | James — DevOps Engineer",
  },
  description:
    "DevOps engineer with a passion for automation, self-hosting, and building reliable infrastructure. Explore my projects, blog, and open-source work.",
  keywords: [
    "DevOps",
    "Docker",
    "Kubernetes",
    "Ansible",
    "Self-Hosted",
    "Homelab",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "James", url: "https://github.com/jtmb" }],
  openGraph: {
    title: "James — DevOps Engineer & Homelab Enthusiast",
    description:
      "DevOps engineer with a passion for automation, self-hosting, and building reliable infrastructure.",
    url: "https://jtmb.dev",
    siteName: "jtmb.dev",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        {/* Skip-to-content link — visible only on keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
        >
          Skip to content
        </a>
        <Providers>
          <AnimatedGradient />
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
