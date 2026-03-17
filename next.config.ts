 import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  
   
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "194.156.118.210",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "https",
        hostname: "burst.shopifycdn.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/model/request.ts");

export default withNextIntl(nextConfig);
