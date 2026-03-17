import React, { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
const replaceMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

vi.mock("@/shared/lib/fetch", () => ({
  Fetch: fetchMock,
}));

vi.mock("@/shared/i18n/model/routing", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock("@/shared/ui/modal/Modal", () => ({
  default: ({ isOpen, children }) =>
    isOpen ? createElement("div", { "data-testid": "modal" }, children) : null,
}));

vi.mock("@/features/add-user-address/ui/addUserAddressModal", () => ({
  default: ({ setOrderInfo, setStep }) =>
    createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          setOrderInfo((state) => ({
            ...state,
            address: {
              id: "addr-1",
              street: "123 Demo Street",
              city: "Tehran",
              state: "Tehran",
              zip: "12345",
              country: "Iran",
              phone: "+989121234567",
            },
          }));
          setStep(2);
        },
      },
      "continue-address",
    ),
}));

vi.mock("@/features/payment-mock/ui/PaymentMockForm", () => ({
  default: ({ setOrderInfo, setStep }) =>
    createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          setOrderInfo((state) => ({
            ...state,
            paymentMode: "mock",
          }));
          setStep(3);
        },
      },
      "continue-payment",
    ),
}));

vi.mock("@/entities/order/ui/ordering", () => ({
  default: ({ success }) =>
    createElement("div", { "data-testid": "ordering-loader" }, success ? "done" : "pending"),
}));

describe("OrderModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("crypto", {
      randomUUID: () => "req-123",
    });
  });

  it("submits checkout once and redirects after a successful order", async () => {
    const user = userEvent.setup();
    const setOrderModal = vi.fn();
    const onOrderCreated = vi.fn().mockResolvedValue(undefined);

    fetchMock.mockResolvedValue({
      status: 200,
      created: true,
      order: { id: "order-1" },
      summary: { totalCents: 1000 },
    });

    const { default: OrderModal } = await import("./OrderModal.jsx");

    render(
      createElement(OrderModal, {
        isOpen: true,
        items: [],
        cart: {
          summary: {
            totalCents: 1000,
          },
        },
        couponInfo: { code: "SAVE10" },
        setOrderModal,
        onOrderCreated,
      }),
    );

    await user.click(screen.getByRole("button", { name: "continue-address" }));
    await user.click(screen.getByRole("button", { name: "continue-payment" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/cart/order", "POST", {
      address: {
        id: "addr-1",
        street: "123 Demo Street",
        city: "Tehran",
        state: "Tehran",
        zip: "12345",
        country: "Iran",
        phone: "+989121234567",
      },
      couponCode: "SAVE10",
      orderRequestId: "req-123",
    });

    await waitFor(() => {
      expect(onOrderCreated).toHaveBeenCalledWith({
        status: 200,
        created: true,
        order: { id: "order-1" },
        summary: { totalCents: 1000 },
      });
      expect(setOrderModal).toHaveBeenCalledWith(false);
      expect(replaceMock).toHaveBeenCalledWith("/orders/order-1");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
