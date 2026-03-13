import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi } from "vitest";
vi.mock("@/shared/lib/fetch", () => ({
  Fetch: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

vi.mock("@/shared/i18n/model/routing", () => ({
  Link: ({ children }) => <span>{children}</span>,
  redirect: () => {},
  useRouter: () => ({ push: () => null }),
  usePathname: () => "/orders",
}));

import OrdersPage from "./page";

describe("Orders page", () => {
  it("renders table rows after fetching orders", async () => {
    const { Fetch } = await import("@/shared/lib/fetch");
    Fetch.mockResolvedValueOnce({
      data: [
        {
          id: "order12345678abc",
          status: "created",
          total_cents: 1500,
          created_at: "2024-01-01T00:00:00Z",
          order_items: [{ quantity: 3 }],
        },
      ],
    });

    render(<OrdersPage />);

    await waitFor(() => {
      expect(Fetch).toHaveBeenCalledWith("/api/orders");
    });

    expect(await screen.findByText(/order123\.\.\./)).toBeInTheDocument();
    const createdBadges = screen.getAllByText("created");
    expect(createdBadges[1]).toBeInTheDocument();
    expect(screen.getByText(/\$15\.00/)).toBeInTheDocument();
  });
});
