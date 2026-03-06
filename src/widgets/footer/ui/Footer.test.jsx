import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

import Footer from "./Footer";

describe("Footer widget", () => {
  it("renders navigation links and copyright", () => {
    render(<Footer />);

    expect(screen.getByText("logo")).toBeInTheDocument();
    expect(screen.getByText("tagline")).toBeInTheDocument();
    expect(screen.getByText("nav.title")).toBeInTheDocument();
    expect(screen.getByText("nav.home")).toBeInTheDocument();
    expect(screen.getByText("nav.products")).toBeInTheDocument();
    expect(screen.getByText("nav.contacts")).toBeInTheDocument();
    expect(screen.getByText("nav.about")).toBeInTheDocument();
    expect(screen.getByText("social.title")).toBeInTheDocument();
    expect(screen.getByText("copyright")).toBeInTheDocument();
  });
});
