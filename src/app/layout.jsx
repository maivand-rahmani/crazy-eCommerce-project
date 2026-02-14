import { NextIntlClientProvider } from "next-intl";
import Header from "@/shared/ui/layout/header/Header";
import FooterCyber from "@/shared/ui/layout/footer/Footer";
import "@/shared/styles/globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/shared/ui/layout/Provider/AuthProvider";

export default async function LocaleLayout({ children }) {
  return (
    <html>
      <NextIntlClientProvider locale="en" messages={null}>
        <body className="mx-auto overflow-auto max-w-[1440px]">
          <AuthProvider>
            <Header />
            <div className="md:pt-22">{children}</div>
            <Toaster position="top-center" reverseOrder={true} />
            <FooterCyber />
          </AuthProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
