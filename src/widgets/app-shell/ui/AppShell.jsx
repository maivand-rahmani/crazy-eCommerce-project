"use client";

import React from "react";

import { usePathname } from "@/shared/i18n";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

const isNestedRoute = (pathname, basePath) => {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
};

const AppShell = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = isNestedRoute(pathname, "/admin");
  const isAuthRoute = isNestedRoute(pathname, "/auth");
  const shouldRenderChrome = !isAdminRoute && !isAuthRoute;

  return (
    <>
      {shouldRenderChrome ? <Header /> : null}
      <div className={shouldRenderChrome ? "md:pt-22" : ""}>{children}</div>
      {shouldRenderChrome ? <Footer /> : null}
    </>
  );
};

export default AppShell;
