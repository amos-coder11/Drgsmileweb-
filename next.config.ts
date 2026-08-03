import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  transpilePackages: ["@paper-design/shaders"],

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(riv)$/,
      type: "asset/resource",
    });

    // Only externalize canvas on the server — applying to client breaks webpack modules
    if (isServer && Array.isArray(config.externals)) {
      config.externals.push({ canvas: "canvas" });
    }

    return config;
  },

  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Alt-Svc", value: 'h3=":443"; ma=86400' },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
  ],

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
