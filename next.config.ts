 
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
   
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vdtwjwohhdejjaweukxw.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
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
