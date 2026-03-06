import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

vi.mock("@/widgets/header/ui/desktop/DesktopHeader", () => ({
  DesktopHeader: () => <div>desktop</div>,
}));
vi.mock("@/widgets/header/ui/mobile/MobileHeader", () => ({
  MobileHeader: () => <div>mobile</div>,
}));

import { Header } from "./Header";

describe("Header widget", () => {
  it("renders both desktop and mobile headers", () => {
    render(<Header />);

    expect(screen.getByText("desktop")).toBeInTheDocument();
    expect(screen.getByText("mobile")).toBeInTheDocument();
  });
});
