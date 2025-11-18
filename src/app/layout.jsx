import { NextIntlClientProvider } from "next-intl";
import Header from "@/Components/header/Header";
import FooterCyber from "@/Components/footer/Footer";
import "./../style/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ensureUserInDB } from "../funcs/ensureUserInDB";

export default async function LocaleLayout({ children }) {
  // Добавляем ползователя в бд если он не существует
  ensureUserInDB();
  return (
    <html>
      <NextIntlClientProvider>
        <body className="mx-auto overflow-auto max-w-[1440px]">
          <ClerkProvider>
            <Header />
            <div className="pt-22">{children}</div>
            <FooterCyber />
          </ClerkProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
