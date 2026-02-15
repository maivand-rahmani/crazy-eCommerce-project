import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "@/shared/ui/layout/header/Header";
import FooterCyber from "@/shared/ui/layout/footer/Footer";
import "@/shared/styles/globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/shared/ui/layout/Provider/AuthProvider";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className="mx-auto overflow-auto max-w-[1440px]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Header />
            <div className="md:pt-22">{children}</div>
            <Toaster position="top-center" reverseOrder={true} />
            <FooterCyber />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
