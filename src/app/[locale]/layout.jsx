import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getMessages } from "next-intl/server";
import "@/shared/styles/globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/shared/ui/layout/Provider/AuthProvider";
import { ThemeProvider } from "@/shared/ui/theme";
import { AppShell } from "@/widgets/app-shell";

export const metadata = {
  title: {
    default: "CrazyCart — Shop Crazy. Live Happy.",
    template: "%s | CrazyCart",
  },
  description:
    "CrazyCart — a modern storefront demo built with Next.js 15, PostgreSQL, Prisma and NextAuth.",
  icons: {
    icon: [
      { url: "/brand/crazycart-icon.svg", type: "image/svg+xml" },
      { url: "/brand/crazycart-icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/brand/crazycart-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} data-theme="dark">
      <body className="mx-auto min-h-screen max-w-[1440px] bg-bg text-text">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Analytics />
          <SpeedInsights />
          <AuthProvider>
            <ThemeProvider>
              <AppShell>{children}</AppShell>
            </ThemeProvider>
            <Toaster position="top-center" reverseOrder={true} />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
