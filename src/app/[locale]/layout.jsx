import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "@/shared/styles/globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/shared/ui/layout/Provider/AuthProvider";
import { AppShell } from "@/widgets/app-shell";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} data-theme="dark">
      <body className="mx-auto min-h-screen max-w-[1440px] bg-bg text-text">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <AppShell>{children}</AppShell>
            <Toaster position="top-center" reverseOrder={true} />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
