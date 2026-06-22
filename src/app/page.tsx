/**
 * Home page — hero section with typewriter animation and About/Skills grid.
 * Fetches GitHub stats server-side for the hero stats bar.
 * The About section uses static data from src/data/skills.ts.
 */
import { Hero } from "@/components/hero/hero-section";
import { AboutSection } from "@/components/hero/about-section";
import { getRepos, getTotalStars, getTopLanguages } from "@/lib/github";

export default async function HomePage() {
  // Fetch GitHub stats for the hero — cached via ISR in the fetch calls
  const [repos, stars, topLanguages] = await Promise.all([
    getRepos(),
    getTotalStars(),
    getTopLanguages(3),
  ]);

  const repoCount = repos?.length ?? 46;
  const starCount = stars;
  const topLangNames = topLanguages.map((l) => l.language);

  return (
    <>
      <Hero repos={repoCount} stars={starCount} topLanguages={topLangNames} />
      <AboutSection />
    </>
  );
}
