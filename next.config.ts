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
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withNextIntl = createNextIntlPlugin({
  // Опционально: можно указать путь к JSON с переводами
  // locales: ['en', 'ru'],
  // defaultLocale: 'en',
});

export default withNextIntl(nextConfig);
