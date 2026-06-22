import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  // MDX options
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  // Enable MDX files as pages
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  // Allow images from GitHub avatars and shields.io for profile README
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.shields.io",
      },
    ],
  },
};

export default withMDX(nextConfig);
