import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const s3PublicUrl = new URL(
  process.env.NEXT_PUBLIC_S3_PUBLIC_URL ||
    "https://s3.ru1.storage.beget.cloud/5427be431039-dev",
);
const s3Pathname = s3PublicUrl.pathname.replace(/\/$/, "");
const s3Protocol = s3PublicUrl.protocol === "http:" ? "http" : "https";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },

  experimental: {
    serverActions: {
      // Allow multipart requests with several images (up to 5MB per file).
      bodySizeLimit: "25mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "burst.shopifycdn.com",
        pathname: "/**",
      },
      {
        protocol: s3Protocol,
        hostname: s3PublicUrl.hostname,
        pathname: `${s3Pathname}/**`,
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/model/request.ts");

export default withNextIntl(nextConfig);
