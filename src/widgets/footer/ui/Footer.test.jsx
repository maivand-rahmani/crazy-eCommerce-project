import React, { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

vi.mock("@/shared/i18n", () => ({
  Link: ({ href, className, children }) =>
    createElement("a", { href, className }, children),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

import Footer from "./Footer";

describe("Footer widget", () => {
  it("renders navigation links and copyright", () => {
    render(createElement(Footer));

    // Store name now comes from settings (DEFAULT_SETTINGS["store.name"] = "Cyber") with fallback to translation
    expect(screen.getAllByText("Cyber")).toHaveLength(2);
    expect(screen.getByText("Dive into the future. Explore, innovate, connect.")).toBeInTheDocument();
    expect(screen.getByText("nav.title")).toBeInTheDocument();
    expect(screen.getByText("nav.home")).toBeInTheDocument();
    expect(screen.getByText("nav.products")).toBeInTheDocument();
    expect(screen.getByText("nav.contacts")).toBeInTheDocument();
    expect(screen.getByText("nav.about")).toBeInTheDocument();
    expect(screen.getByText("social.title")).toBeInTheDocument();
    expect(screen.getByText("copyright")).toBeInTheDocument();
  });
});
