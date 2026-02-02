import { NextIntlClientProvider } from "next-intl";
import Header from "@/shared/ui/layout/header/Header";
import FooterCyber from "@/shared/ui/layout/footer/Footer";
import "@/shared/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export default async function LocaleLayout({ children }) {
  return (
    <html>
      <NextIntlClientProvider>
        <body className="mx-auto overflow-auto max-w-[1440px]">
          
            <ClerkProvider>
              <Header />
              <div className="md:pt-22">{children}</div>
              <Toaster position="top-center" reverseOrder={true} />
              <FooterCyber />
            </ClerkProvider>
         
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
