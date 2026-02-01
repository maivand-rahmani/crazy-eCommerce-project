import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/header/Header";
import FooterCyber from "@/components/footer/Footer";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ensureUserInDB } from "@/funcs/ensureUserInDB";
import { Toaster } from "react-hot-toast";

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
