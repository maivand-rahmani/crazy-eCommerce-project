import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();
vi.mock("@/shared/lib", () => ({ Fetch: fetchMock }));

const sessionUser = { user: { id: "user-1" } };
const sessionModule = {
  authParams: {},
};

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authParams: {},
}));

describe("CommentAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("throws when there is no session user id", async () => {
    const { CommentAction } = await import("./FormAction.js");
    const formData = new FormData();
    formData.set("comment", "Nice");
    formData.set("rating", "5");
    formData.set("productId", "12");

    const { getServerSession } = await import("next-auth");
    getServerSession.mockResolvedValueOnce(null);

    await expect(CommentAction(formData)).rejects.toThrow("Unauthorized");
  });

  it("submits comment when session exists", async () => {
    const { getServerSession } = await import("next-auth");
    getServerSession.mockResolvedValueOnce(sessionUser);
    fetchMock.mockResolvedValue({ success: true });

    const { CommentAction } = await import("./FormAction.js");
    const formData = new FormData();
    formData.set("comment", "Great");
    formData.set("rating", "4");
    formData.set("productId", "22");

    const result = await CommentAction(formData);

    expect(result).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/products/comments",
      "POST",
      {
        comment: "Great",
        rating: 4,
        productId: 22,
        user_id: "user-1",
      },
    );
  });
});
