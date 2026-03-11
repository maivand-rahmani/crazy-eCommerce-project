import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(),
}));

vi.mock("@/shared/i18n", () => ({
  Link: ({ href, className, children }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  usePathname: usePathnameMock,
}));

import NavLink from "./NavLink";

describe("NavLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("applies the active class when the current path starts with href", () => {
    usePathnameMock.mockReturnValue("/catalog/phones");

    render(
      <NavLink href="/catalog" className="base" isActiveStyle="active">
        Catalog
      </NavLink>,
    );

    expect(screen.getByRole("link", { name: "Catalog" })).toHaveClass("base");
    expect(screen.getByRole("link", { name: "Catalog" })).toHaveClass("active");
  });

  it("requires an exact match when exact mode is enabled", () => {
    usePathnameMock.mockReturnValue("/catalog/phones");

    render(
      <NavLink
        href="/catalog"
        className="base"
        isActiveStyle="active"
        exact
      >
        Catalog
      </NavLink>,
    );

    expect(screen.getByRole("link", { name: "Catalog" })).toHaveClass("base");
    expect(screen.getByRole("link", { name: "Catalog" })).not.toHaveClass("active");
  });
});
