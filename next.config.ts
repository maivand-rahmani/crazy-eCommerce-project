import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const s3PublicUrl = new URL(
  process.env.NEXT_PUBLIC_S3_PUBLIC_URL ||
    "https://s3.ru1.storage.beget.cloud/5427be431039-dev",
);
const s3ProductPrefix = process.env.NEXT_PUBLIC_S3_PRODUCT_PREFIX || "products";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  
   
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "burst.shopifycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.ru1.storage.beget.cloud",
        pathname: "/**"
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/model/request.ts");

export default withNextIntl(nextConfig);
