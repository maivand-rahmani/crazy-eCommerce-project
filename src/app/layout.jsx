import { NextIntlClientProvider } from "next-intl";
import Header from "@/shared/ui/layout/header/Header";
import FooterCyber from "@/shared/ui/layout/footer/Footer";
import "@/shared/styles/globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/shared/ui/layout/Provider/AuthProvider";
import { CompareProvider } from "@/features/compare-products/model/CompareContext";
import CompareFloatingBar from "@/features/compare-products/ui/CompareFloatingBar";

export default async function LocaleLayout({ children }) {
  return (
    <html>
      <NextIntlClientProvider>
        <body className="mx-auto overflow-auto max-w-[1440px]">
          <AuthProvider>
            <CompareProvider>
              <Header />
              <div className="md:pt-22">{children}</div>
              <CompareFloatingBar />
              <Toaster position="top-center" reverseOrder={true} />
              <FooterCyber />
            </CompareProvider>
          </AuthProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
