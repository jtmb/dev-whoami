/**
 * Tests for SEO infrastructure (sitemap.xml and robots.txt).
 * Validates that files exist, have correct structure, and contain expected content.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const publicDir = join(projectRoot, "public");

describe("SEO Infrastructure", () => {
  it("sitemap.xml exists in public directory", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    expect(readFileSync(sitemapPath, "utf-8")).toBeTruthy();
  });

  it("robots.txt exists in public directory", () => {
    const robotsPath = `${publicDir}/robots.txt`;
    expect(readFileSync(robotsPath, "utf-8")).toBeTruthy();
  });

  it("sitemap.xml has valid XML declaration", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  });

  it("sitemap.xml has urlset element", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  });

  it("sitemap.xml contains homepage URL", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<loc>https:\/\/jtmb\.dev\/<\/loc>/);
  });

  it("sitemap.xml contains about page URL", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<loc>https:\/\/jtmb\.dev\/about<\/loc>/);
  });

  it("sitemap.xml contains projects page URL", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<loc>https:\/\/jtmb\.dev\/projects<\/loc>/);
  });

  it("sitemap.xml contains repos page URL", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<loc>https:\/\/jtmb\.dev\/repos<\/loc>/);
  });

  it("sitemap.xml contains contact page URL", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<loc>https:\/\/jtmb\.dev\/contact<\/loc>/);
  });

  it("sitemap.xml contains blog page URL", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<loc>https:\/\/jtmb\.dev\/blog<\/loc>/);
  });

  it("robots.txt allows all user agents", () => {
    const robotsPath = `${publicDir}/robots.txt`;
    const content = readFileSync(robotsPath, "utf-8");
    expect(content).toMatch(/User-agent\s*:\s*\*/);
  });

  it("robots.txt allows all paths", () => {
    const robotsPath = `${publicDir}/robots.txt`;
    const content = readFileSync(robotsPath, "utf-8");
    expect(content).toMatch(/Allow: \//);
  });

  it("robots.txt references sitemap", () => {
    const robotsPath = `${publicDir}/robots.txt`;
    const content = readFileSync(robotsPath, "utf-8");
    expect(content).toMatch(/Sitemap: https:\/\/jtmb\.dev\/sitemap\.xml/);
  });

  it("sitemap.xml has lastmod dates", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<lastmod>2026-06-23<\/lastmod>/);
  });

  it("sitemap.xml has priority values", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<priority>1\.0<\/priority>/);
    expect(content).toMatch(/<priority>0\.8<\/priority>/);
    expect(content).toMatch(/<priority>0\.9<\/priority>/);
  });

  it("sitemap.xml has closing urlset tag", () => {
    const sitemapPath = `${publicDir}/sitemap.xml`;
    const content = readFileSync(sitemapPath, "utf-8");
    expect(content).toMatch(/<\/urlset>/);
  });
});