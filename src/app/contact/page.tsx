/**
 * Contact page — links and ways to reach out.
 * Static page with GitHub profile, email link, and optional form.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Globe } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { GitHubIcon } from "@/components/shared/github-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with James — DevOps engineer, open-source contributor, and homelab enthusiast.",
};

export default function ContactPage() {
  return (
    <SectionWrapper>
      <AnimatedReveal>
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <GradientText>Get in Touch</GradientText>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Have a question, project idea, or just want to say hi? Reach out
          through any of the channels below.
        </p>
      </AnimatedReveal>

      <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-3">
        {/* GitHub */}
        <AnimatedReveal delay={0}>
          <Card className="text-center transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <GitHubIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-base">GitHub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Check out my repos, open an issue, or start a discussion.
              </p>
              <Button
                variant="outline"
                size="sm"
                render={
                  <a
                    href="https://github.com/jtmb"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                @jtmb
              </Button>
            </CardContent>
          </Card>
        </AnimatedReveal>

        {/* Portfolio */}
        <AnimatedReveal delay={0.1}>
          <Card className="text-center transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-base">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Explore my projects, blog, and DevOps tooling showcase.
              </p>
              <Button variant="outline" size="sm" render={<Link href="/projects" />}>
                View Projects
              </Button>
            </CardContent>
          </Card>
        </AnimatedReveal>

        {/* Email */}
        <AnimatedReveal delay={0.2}>
          <Card className="text-center transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-base">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Prefer email? Reach out and I&apos;ll get back to you.
              </p>
              <Button
                variant="outline"
                size="sm"
                render={<a href="mailto:jtmb@users.noreply.github.com" />}
              >
                Send Email
              </Button>
            </CardContent>
          </Card>
        </AnimatedReveal>
      </div>
    </SectionWrapper>
  );
}
