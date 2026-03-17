import React, { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

vi.mock("@/widgets/header/ui/desktop/DesktopHeader", () => ({
  DesktopHeader: () => createElement("div", null, "desktop"),
}));
vi.mock("@/widgets/header/ui/mobile/MobileHeader", () => ({
  MobileHeader: () => createElement("div", null, "mobile"),
}));

import { Header } from "./Header";

describe("Header widget", () => {
  it("renders both desktop and mobile headers", () => {
    render(createElement(Header));

    expect(screen.getByText("desktop")).toBeInTheDocument();
    expect(screen.getByText("mobile")).toBeInTheDocument();
  });
});
