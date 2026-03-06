import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, afterEach, vi } from "vitest";
import ProductSearch from "./ProductSearch";

const pushMock = vi.fn();
vi.mock("@/shared/i18n/model/routing", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("ProductSearch", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                variant_id: "v1",
                category_id: "c1",
                product_name: "Fancy Watch",
                price_cents: 19900,
                avg_rating: 4.5,
                image_url: null,
                variant_name: "Black",
              },
            ],
          }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("searches after debounce and opens results", async () => {
    const user = userEvent.setup();
    render(<ProductSearch />);

    await user.type(screen.getByPlaceholderText("Search products..."), "watch");
    await act(() => new Promise((resolve) => setTimeout(resolve, 400)));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/products/search?search=watch&limit=5",
      ),
    );

    expect(await screen.findByText("Fancy Watch")).toBeInTheDocument();
  });

  it("navigates to search page when clicking view all", async () => {
    const user = userEvent.setup();
    render(<ProductSearch />);

    await user.type(screen.getByPlaceholderText("Search products..."), "watch");
    await act(() => new Promise((resolve) => setTimeout(resolve, 400)));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    await user.click(screen.getByText("View all results"));

    expect(pushMock).toHaveBeenCalledWith("/search?q=watch");
  });
});
